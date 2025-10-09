package user

import (
	"log"

	"branchline.me/server/src/libs/go/middleware"
	"branchline.me/server/src/libs/go/utils"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func RegisterUserRoutes(api fiber.Router, db *sqlx.DB) {
	userGroup := api.Group("/users")
	authMiddleware := middleware.AuthenticationMiddleware()
	registerUserWithEmailRoute(userGroup, db)
	verifyEmailRoute(userGroup, db, authMiddleware)
	resendVerificationEmailRoute(userGroup, db, authMiddleware)
	refreshTokenRoute(userGroup)
	logoutRoute(userGroup, authMiddleware)
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
		userID, status, err := RegisterUserWithEmailService(user, db)
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
		token, refreshToken, err := utils.GenerateToken(userID, "user", false, false)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate token",
			})
		}
		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    refreshToken,
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
			Path:     "/",
		})

		return c.Status(status).JSON(fiber.Map{
			"message":      "User registered successfully. Please verify your email.",
			"access_token": token,
		})
	})
}

func verifyEmailRoute(userGroup fiber.Router, db *sqlx.DB, authMiddleware fiber.Handler) {
	userGroup.Post("/verify-email", authMiddleware, func(c *fiber.Ctx) error {
		var request struct {
			OTPCode string `json:"otp_code" validate:"required,len=6"`
		}
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Invalid request body",
			})
		}

		errors := ValidateEmailVerification(request.OTPCode)
		if errors != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Validation failed",
				"errors":  errors,
			})
		}
		userID := c.Locals("user_id").(string)

		tokens, status, err := VerifyEmailService(userID, request.OTPCode, db)
		if err != nil {
			return c.Status(status).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}
		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    tokens.RefreshToken,
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
		})
		return c.Status(status).JSON(fiber.Map{
			"success": true,
			"message": "Email verified successfully. Your account is now active.",
			"token":   tokens.AccessToken,
		})
	})
}

func resendVerificationEmailRoute(userGroup fiber.Router, db *sqlx.DB, authMiddleware fiber.Handler) {
	userGroup.Post("/resend-verification", authMiddleware, func(c *fiber.Ctx) error {
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

func refreshTokenRoute(userGroup fiber.Router) {
	userGroup.Post("/refresh-token", func(c *fiber.Ctx) error {
		// Get refresh token from cookies
		cookie := c.Cookies("refresh_token")
		log.Default().Printf("Refresh token cookie: %s", cookie)
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing refresh token",
			})
		}

		// Refresh the tokens
		newToken, newRefreshToken, err := utils.RefreshToken(cookie)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired refresh token",
			})
		}

		// Set the new refresh token in cookies
		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    newRefreshToken,
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
		})

		// Return the new access token
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"access_token": newToken,
		})
	})
}

func logoutRoute(userGroup fiber.Router, authMiddleware fiber.Handler) {
	userGroup.Post("/logout", authMiddleware, func(c *fiber.Ctx) error {
		// Clear the refresh token cookie
		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    "",
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
		})

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Logged out successfully",
		})
	})
}
