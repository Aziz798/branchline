package user

import (
	"branchline.me/server/src/libs/go/models"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func RegisterUserWithEmailQuery(user types.UserRegistrationType, hashedOTP string, tx *sqlx.Tx) (uuid.UUID, error) {
	q := `INSERT INTO users (name, email, password, login_provider, is_active, otp_secret) 
			VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	var userID uuid.UUID
	err := tx.QueryRow(q, user.Name, user.Email, user.Password, "email", false, hashedOTP).Scan(&userID)
	if err != nil {
		return uuid.Nil, err
	}
	return userID, nil
}

func CheckIfUserExistsByEmailQuery(email string, db *sqlx.DB) (bool, error) {
	var exists bool
	q := `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`
	err := db.Get(&exists, q, email)
	return exists, err
}

func GetUserByEmailQuery(email string, db *sqlx.DB) (*models.UserTable, error) {
	var user models.UserTable
	q := `SELECT id,name, email, role, password, is_active, is_premium, 
			premium_start_date, premium_end_date, login_provider, otp_secret, created_at, updated_at
			FROM users WHERE email=$1`
	err := db.Get(&user, q, email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func ActivateUserAndClearOTPQuery(userID string, db *sqlx.DB) error {
	q := `UPDATE users SET is_active = true, otp_secret = NULL, updated_at = NOW() WHERE id = $1`
	_, err := db.Exec(q, userID)
	return err
}

func UpdateUserOTPQuery(email, hashedOTP string, db *sqlx.DB) error {
	q := `UPDATE users SET otp_secret = $1, updated_at = NOW() WHERE email = $2`
	_, err := db.Exec(q, hashedOTP, email)
	return err
}

func GetUserByIDQuery(userID string, db *sqlx.DB) (*models.UserTable, error) {
	var user models.UserTable
	q := `SELECT id, name, email, role, password, is_active, is_premium, 
			premium_start_date, premium_end_date, login_provider, otp_secret, created_at, updated_at
			FROM users WHERE id=$1`
	err := db.Get(&user, q, userID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
