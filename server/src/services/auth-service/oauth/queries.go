package oauth

import (
	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func registerUserWithGoogleQuery(user types.GoogleOauthUser, db *sqlx.DB) (uuid.UUID, error) {
	q := `INSERT INTO users (name, email, login_provider, is_active) 
			VALUES ($1, $2, $3, $4) RETURNING id`
	var userID uuid.UUID
	err := db.QueryRow(q, user.Name, user.Email, "google", true).Scan(&userID)
	if err != nil {
		return uuid.Nil, err
	}
	return userID, nil
}
