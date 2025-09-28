package user

import (
	"branchline.me/server/src/libs/go/validations"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

// RegisterHandler handles user registration
func RegisterHandler(c *fiber.Ctx, db *sqlx.DB, v validations.Validator) error {
	userRegistration, err := ParseAndValidateUserRegistration(c, v)
	if err != nil {
		return err
	}

	result, err := RegisterUser(userRegistration, db)
	if err != nil {
		return HandleServiceError(c, err)
	}

	return RespondWithTokens(c, "User created successfully", result.Tokens, fiber.StatusCreated)
}

// VerifyOTPHandler handles OTP verification
func VerifyOTPHandler(c *fiber.Ctx, db *sqlx.DB, v validations.Validator) error {
	otpRequest, err := ParseAndValidateOTPRequest(c, v)
	if err != nil {
		return err
	}

	userID := c.Locals("user_id").(string)
	userRole := c.Locals("user_role").(string)
	isPremium := c.Locals("is_premium").(bool)

	tokens, err := VerifyUserOTP(userID, userRole, isPremium, otpRequest.Code, db)
	if err != nil {
		return HandleServiceError(c, err)
	}

	return RespondWithTokens(c, "User verified successfully", tokens, fiber.StatusOK)
}
