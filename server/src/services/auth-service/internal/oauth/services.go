package oauth

import (
	"errors"
	"fmt"
	"log"

	"branchline.me/server/src/services/auth-service/internal/types"
	"branchline.me/server/src/services/auth-service/internal/user"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

var (
	ErrDatabaseOperation = errors.New("database operation failed")
	ErrUserExists        = errors.New("user with this email already exists")
)

func registerUserWithGoogleService(userData types.GoogleOauthUser, db *sqlx.DB) (uuid.UUID, int, error) {
	exists, err := user.CheckIfUserExistsByEmailQuery(userData.Email, db)
	if err != nil {
		log.Default().Println("Error checking user existence:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}
	if exists {
		userFromDb, err := user.GetUserByEmailQuery(userData.Email, db)
		if err != nil {
			log.Default().Println("Error fetching user:", err)
			return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
		}
		return userFromDb.ID.Bytes, fiber.StatusOK, nil
	}
	tx, err := db.Beginx()
	if err != nil {
		log.Default().Println("Error starting transaction:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to start transaction: %v", ErrDatabaseOperation, err)
	}
	defer tx.Rollback()
	userID, err := registerUserWithGoogleQuery(userData, tx)
	if err != nil {
		log.Default().Println("Error registering user:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}
	if err = tx.Commit(); err != nil {
		log.Default().Println("Error committing transaction:", err)
		return userID, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to commit transaction: %v", ErrDatabaseOperation, err)
	}

	return userID, fiber.StatusCreated, nil
}
