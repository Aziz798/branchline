package user

import (
	"branchline.me/server/src/libs/go/validations"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/go-playground/validator/v10"
)

func ValidateUserRegistrationWithEmail(user types.UserRegistrationType) []string {
	v := validations.GetGlobalValidator()
	errors := v.Validate(user)
	if len(errors) > 0 {
		return errors
	}
	return nil
}

func ValidateEmailVerification(email, otpCode string) []string {
	v := validator.New()

	type EmailVerificationRequest struct {
		Email   string `validate:"required,email"`
		OTPCode string `validate:"required,len=6"`
	}

	request := EmailVerificationRequest{
		Email:   email,
		OTPCode: otpCode,
	}

	var errors []string
	if err := v.Struct(request); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			switch err.Field() {
			case "Email":
				errors = append(errors, "valid email is required")
			case "OTPCode":
				errors = append(errors, "6-digit OTP code is required")
			}
		}
	}

	return errors
}

func ValidateEmailResend(email string) []string {
	v := validator.New()

	type EmailResendRequest struct {
		Email string `validate:"required,email"`
	}

	request := EmailResendRequest{Email: email}

	var errors []string
	if err := v.Struct(request); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			if err.Field() == "Email" {
				errors = append(errors, "valid email is required")
			}
		}
	}

	return errors
}
