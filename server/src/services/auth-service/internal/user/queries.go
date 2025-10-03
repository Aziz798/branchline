package user

import (
	"branchline.me/server/src/libs/go/models"
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/jmoiron/sqlx"
)

func RegisterUserWithEmailQuery(user types.UserRegistrationType, hashedOTP string, tx *sqlx.Tx) error {
	q := `INSERT INTO users (first_name, last_name, email, password, login_provider, is_active, otp_secret) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := tx.Exec(q, user.FirstName, user.LastName, user.Email, user.Password, "email", false, hashedOTP)
	return err
}

func CheckIfUserExistsByEmailQuery(email string, db *sqlx.DB) (bool, error) {
	var exists bool
	q := `SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)`
	err := db.Get(&exists, q, email)
	return exists, err
}

func GetUserByEmailQuery(email string, db *sqlx.DB) (*models.UserTable, error) {
	var user models.UserTable
	q := `SELECT id, first_name, last_name, email, role, password, is_active, is_premium, 
          premium_start_date, premium_end_date, login_provider, otp_secret, created_at, updated_at
          FROM users WHERE email=$1`
	err := db.Get(&user, q, email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func ActivateUserAndClearOTPQuery(email string, db *sqlx.DB) error {
	q := `UPDATE users SET is_active = true, otp_secret = NULL, updated_at = NOW() WHERE email = $1`
	_, err := db.Exec(q, email)
	return err
}

func UpdateUserOTPQuery(email, hashedOTP string, db *sqlx.DB) error {
	q := `UPDATE users SET otp_secret = $1, updated_at = NOW() WHERE email = $2`
	_, err := db.Exec(q, hashedOTP, email)
	return err
}
