package user

import (
	"errors"
	"log"

	"branchline.me/server/src/libs/go/email"
	"branchline.me/server/src/libs/go/utils"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/jmoiron/sqlx"
)

// Service errors
var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrInvalidOTP        = errors.New("invalid OTP code")
	ErrInternalServer    = errors.New("internal server error")
)

type UserRegistrationResult struct {
	Tokens TokenPair
	UserID string
}

// RegisterUser handles the business logic for user registration
func RegisterUser(userRegistration types.UserRegistrationType, db *sqlx.DB) (*UserRegistrationResult, error) {
	// Check if user exists
	exists, err := userExistsQuery(userRegistration.Email, db)
	if err != nil {
		log.Printf("error checking user existence: %s", err.Error())
		return nil, ErrInternalServer
	}
	if exists {
		return nil, ErrUserAlreadyExists
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(userRegistration.Password)
	if err != nil {
		log.Printf("error hashing password: %s", err.Error())
		return nil, ErrInternalServer
	}

	// Create user
	userRegistration.Password = hashedPassword
	otpCode, userId, err := createUserByEmailQuery(userRegistration, db)
	if err != nil {
		log.Printf("error creating user: %s", err.Error())
		return nil, ErrInternalServer
	}

	// Generate tokens
	tokens, err := GenerateUserTokens(userId, false)
	if err != nil {
		log.Printf("error generating tokens: %s", err.Error())
		return nil, ErrInternalServer
	}

	// Send verification email
	if err := email.SendEmailVerificationEmail(otpCode, userRegistration.Email); err != nil {
		log.Printf("error sending email: %s", err.Error())
		return nil, ErrInternalServer
	}

	return &UserRegistrationResult{
		Tokens: tokens,
		UserID: userId,
	}, nil
}

// VerifyUserOTP handles the business logic for OTP verification
func VerifyUserOTP(userID, userRole string, isPremium bool, otpCode string, db *sqlx.DB) (TokenPair, error) {
	// Get stored OTP
	hashedOtp, err := getUserOtpCodeQuery(userID, db)
	if err != nil {
		log.Printf("error getting user OTP code: %s", err.Error())
		return TokenPair{}, ErrInternalServer
	}

	// Verify OTP
	if err := utils.VerifyOTP(hashedOtp, otpCode); err != nil {
		log.Printf("error verifying OTP: %s", err.Error())
		log.Printf("Invalid OTP code: %s", otpCode)
		log.Printf("Hashed OTP: %s", hashedOtp)
		return TokenPair{}, ErrInvalidOTP
	}

	// Mark user as verified
	if err := verifyUserOtpCodeQuery(userID, db); err != nil {
		log.Printf("error verifying user OTP code: %s", err.Error())
		return TokenPair{}, ErrInternalServer
	}

	// Generate new tokens for verified user
	tokens, err := GenerateVerifiedUserTokens(userID, userRole, isPremium)
	if err != nil {
		log.Printf("error generating verified tokens: %s", err.Error())
		return TokenPair{}, ErrInternalServer
	}

	return tokens, nil
}
