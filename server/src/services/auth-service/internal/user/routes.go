package user

import (
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func RegisterUserRoutes(api fiber.Router, db *sqlx.DB) {
	userGroup := api.Group("/user")
	registerUserWithEmailRoute(userGroup, db)
	verifyEmailRoute(userGroup, db)
	resendVerificationEmailRoute(userGroup, db)
}

func registerUserWithEmailRoute(userGroup fiber.Router, db *sqlx.DB) {
	userGroup.Post("/register", func(c *fiber.Ctx) error {
		var user types.UserRegistrationType
		if err := c.BodyParser(&user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}
		errors := ValidateUserRegistrationWithEmail(user)
		if errors != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"errors": errors,
			})
		}
		status, err := RegisterUserWithEmailService(user, db)
		if err != nil {
			if status == fiber.StatusConflict {
				return c.Status(status).JSON(fiber.Map{
					"error": err.Error(),
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Internal server error",
			})
		}
		return c.SendStatus(status)
	})
}

func verifyEmailRoute(userGroup fiber.Router, db *sqlx.DB) {
	userGroup.Post("/verify-email", func(c *fiber.Ctx) error {
		var request struct {
			Email   string `json:"email" validate:"required,email"`
			OTPCode string `json:"otp_code" validate:"required,len=6"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid request body",
			})
		}

		errors := ValidateEmailVerification(request.Email, request.OTPCode)
		if errors != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Validation failed",
				"errors":  errors,
			})
		}

		status, err := VerifyEmailService(request.Email, request.OTPCode, db)
		if err != nil {
			return c.Status(status).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		return c.Status(status).JSON(fiber.Map{
			"success": true,
			"message": "Email verified successfully. Your account is now active.",
		})
	})
}

func resendVerificationEmailRoute(userGroup fiber.Router, db *sqlx.DB) {
	userGroup.Post("/resend-verification", func(c *fiber.Ctx) error {
		var request struct {
			Email string `json:"email" validate:"required,email"`
		}

		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid request body",
			})
		}

		errors := ValidateEmailResend(request.Email)
		if errors != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Validation failed",
				"errors":  errors,
			})
		}

		status, err := ResendVerificationEmailService(request.Email, db)
		if err != nil {
			return c.Status(status).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		return c.Status(status).JSON(fiber.Map{
			"success": true,
			"message": "Verification email sent successfully. Please check your email.",
		})
	})
}
