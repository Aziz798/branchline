package user

import (
	"branchline.me/server/src/libs/go/validations"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/go-playground/validator/v10"
)

var v = validations.GetGlobalValidator()

func ValidateUserRegistrationWithEmail(user types.UserRegistrationType) interface{} {
	errors := v.Validate(user)
	if errors != nil {
		return errors
	}
	return nil
}

func ValidateEmailVerification(otpCode string) interface{} {

	type EmailVerificationRequest struct {
		OTPCode string `validate:"required,len=6"`
	}
	errors := v.Validate(EmailVerificationRequest{OTPCode: otpCode})
	if errors != nil {
		return errors
	}
	return nil
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
