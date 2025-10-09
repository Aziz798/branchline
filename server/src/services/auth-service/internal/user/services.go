package user

import (
	"errors"
	"fmt"
	"log"

	"branchline.me/server/src/libs/go/email"
	mailLibrary "branchline.me/server/src/libs/go/email"
	"branchline.me/server/src/libs/go/utils"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

var (
	ErrUserExists        = errors.New("user with this email already exists")
	ErrUserNotFound      = errors.New("user with this email does not exist")
	ErrEmailSendFailed   = errors.New("failed to send verification email")
	ErrOTPGeneration     = errors.New("failed to generate OTP")
	ErrPasswordHashing   = errors.New("failed to hash password")
	ErrDatabaseOperation = errors.New("database operation failed")
)

func RegisterUserWithEmailService(user types.UserRegistrationType, db *sqlx.DB) (uuid.UUID, int, error) {
	// Check if user already exists
	exists, err := CheckIfUserExistsByEmailQuery(user.Email, db)
	if err != nil {
		log.Default().Println("Error checking user existence:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}
	if exists {
		return uuid.Nil, fiber.StatusConflict, ErrUserExists
	}

	// Hash the password
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		log.Default().Println("Error hashing password:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrPasswordHashing, err)
	}
	user.Password = hashedPassword

	// Generate OTP for email verification
	otpCode, err := utils.GenerateOTPCode()
	if err != nil {
		log.Default().Println("Error generating OTP:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrOTPGeneration, err)
	}

	// Hash the OTP for storage
	hashedOTP, err := utils.HashOTP(otpCode)
	if err != nil {
		log.Default().Println("Error hashing OTP:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrPasswordHashing, err)
	}

	// Start database transaction
	tx, err := db.Beginx()
	if err != nil {
		log.Default().Println("Error starting transaction:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to start transaction: %v", ErrDatabaseOperation, err)
	}
	defer tx.Rollback()

	// Register user with hashed OTP
	userID, err := RegisterUserWithEmailQuery(user, hashedOTP, tx)
	if err != nil {
		log.Default().Println("Error registering user:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}

	// Send verification email
	err = email.SendEmailVerificationEmail(otpCode, user.Email)
	if err != nil {
		log.Default().Println("Error sending verification email:", err)
		return userID, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrEmailSendFailed, err)
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		log.Default().Println("Error committing transaction:", err)
		return userID, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to commit transaction: %v", ErrDatabaseOperation, err)
	}

	return userID, fiber.StatusCreated, nil
}

func VerifyEmailService(userID, otpCode string, db *sqlx.DB) (*types.Tokens, int, error) {
	// Get user by email
	user, err := GetUserByIDQuery(userID, db)
	if err != nil {
		return nil, fiber.StatusNotFound, ErrUserNotFound
	}

	// Check if user is already active
	if user.IsActive.Bool {
		return nil, fiber.StatusBadRequest, errors.New("user email is already verified")
	}

	// Verify OTP
	if user.OtpSecret.String == "" {
		return nil, fiber.StatusBadRequest, errors.New("no verification code found for this user")
	}

	err = utils.VerifyOTP(user.OtpSecret.String, otpCode)
	if err != nil {
		return nil, fiber.StatusBadRequest, errors.New("invalid or expired verification code")
	}

	// Activate user and clear OTP
	err = ActivateUserAndClearOTPQuery(userID, db)
	if err != nil {
		return nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}
	token, refreshToken, err := utils.GenerateToken(user.ID.Bytes, string(user.Role), user.IsPremium.Bool, user.IsActive.Bool)
	if err != nil {
		return nil, fiber.StatusInternalServerError, fmt.Errorf("failed to generate auth token: %v", err)
	}
	return &types.Tokens{
		AccessToken:  token,
		RefreshToken: refreshToken,
	}, fiber.StatusOK, nil
}

func ResendVerificationEmailService(email string, db *sqlx.DB) (int, error) {
	// Check if user exists
	exists, err := CheckIfUserExistsByEmailQuery(email, db)
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}
	if !exists {
		return fiber.StatusNotFound, ErrUserNotFound
	}

	// Get user details
	user, err := GetUserByEmailQuery(email, db)
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}

	// Check if user is already active
	if user.IsActive.Bool {
		return fiber.StatusBadRequest, errors.New("user email is already verified")
	}

	// Generate new OTP
	otpCode, err := utils.GenerateOTPCode()
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrOTPGeneration, err)
	}

	// Hash the new OTP
	hashedOTP, err := utils.HashOTP(otpCode)
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrPasswordHashing, err)
	}

	// Update OTP in database
	err = UpdateUserOTPQuery(email, hashedOTP, db)
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}

	// Send verification email
	err = mailLibrary.SendEmailVerificationEmail(otpCode, email)
	if err != nil {
		return fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrEmailSendFailed, err)
	}

	return fiber.StatusOK, nil
}
