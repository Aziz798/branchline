package user

import (
	"log"

	"branchline.me/server/src/libs/go/validations"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
)

// ParseAndValidateUserRegistration parses and validates user registration request
func ParseAndValidateUserRegistration(c *fiber.Ctx, v validations.Validator) (types.UserRegistrationType, error) {
	var userRegistration types.UserRegistrationType
	if err := c.BodyParser(&userRegistration); err != nil {
		log.Printf("error parsing request body: %s", err.Error())
		return userRegistration, c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	errList := v.Validate(userRegistration)
	if len(errList) > 0 {
		return userRegistration, c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{"status": "failed", "error": errList})
	}

	return userRegistration, nil
}

// ParseAndValidateOTPRequest parses and validates OTP verification request
func ParseAndValidateOTPRequest(c *fiber.Ctx, v validations.Validator) (OTPRequest, error) {
	var otpRequest OTPRequest
	if err := c.BodyParser(&otpRequest); err != nil {
		log.Printf("error parsing request body: %s", err.Error())
		return otpRequest, c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	errList := v.Validate(otpRequest)
	if len(errList) > 0 {
		return otpRequest, c.Status(fiber.StatusBadRequest).JSON(&fiber.Map{"status": "failed", "error": errList})
	}

	return otpRequest, nil
}

// HandleServiceError converts service errors to HTTP responses
func HandleServiceError(c *fiber.Ctx, err error) error {
	switch err {
	case ErrUserAlreadyExists:
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "User already exists",
		})
	case ErrInvalidOTP:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid OTP code",
		})
	case ErrInternalServer:
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	default:
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}
}

// RespondWithTokens sends a success response with tokens
func RespondWithTokens(c *fiber.Ctx, message string, tokens TokenPair, statusCode int) error {
	return c.Status(statusCode).JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"message":       message,
			"token":         tokens.Token,
			"refresh_token": tokens.RefreshToken,
		},
	})
}
