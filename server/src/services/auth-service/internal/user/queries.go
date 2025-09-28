package user

import (
	"fmt"

	globalTypes "branchline.me/server/src/libs/go/models"
	"branchline.me/server/src/libs/go/utils"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/jmoiron/sqlx"
)

func userExistsQuery(email string, db *sqlx.DB) (bool, error) {
	q := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	var exists bool
	err := db.Get(&exists, q, email)
	if err != nil {
		return false, fmt.Errorf("error checking if user exists: %s", err.Error())
	}
	return exists, nil
}

func createUserByEmailQuery(userRegistration types.UserRegistrationType, db *sqlx.DB) (string, string, error) {
	q := `INSERT INTO users (first_name, last_name, email, password, login_provider, otp_secret) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	otpCode, err := utils.GenerateOTPCode()
	if err != nil {
		return "", "", fmt.Errorf("error generating OTP code: %s", err.Error())
	}
	hashedOTP, err := utils.HashOTP(otpCode)
	if err != nil {
		return "", "", fmt.Errorf("error hashing OTP: %s", err.Error())
	}
	var userID string
	err = db.Get(&userID, q, userRegistration.FirstName, userRegistration.LastName, userRegistration.Email, userRegistration.Password, globalTypes.EmailUserLoginProvider, hashedOTP)
	if err != nil {
		return "", "", fmt.Errorf("error creating user: %s", err.Error())
	}
	return otpCode, userID, nil
}

func getUserOtpCodeQuery(userID string, db *sqlx.DB) (string, error) {
	q := `SELECT otp_secret FROM users WHERE id = $1`
	var otpCode string
	err := db.Get(&otpCode, q, userID)
	if err != nil {
		return "", fmt.Errorf("error getting user OTP code: %s", err.Error())
	}
	return otpCode, nil
}

func verifyUserOtpCodeQuery(userID string, db *sqlx.DB) error {
	q := `UPDATE users SET is_active = true WHERE id = $1`
	_, err := db.Exec(q, userID)
	if err != nil {
		return fmt.Errorf("error verifying user OTP code: %s", err.Error())
	}
	return nil
}
