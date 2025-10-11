package projects

import (
	"errors"
	"fmt"
	"log"

	"branchline.me/server/src/services/projects-service/internal/types"
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

func createProjectService(projectReq types.CreateProjectRequest, userID string, isPremium bool, db *sqlx.DB) (uuid.UUID, int, error) {
	tx, err := db.Beginx()
	if err != nil {
		log.Default().Println("Error starting transaction:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to start transaction: %v", ErrDatabaseOperation, err)
	}
	defer func() {
		if tx != nil {
			tx.Rollback()
		}
	}()

	if !isPremium {
		count, err := checkHowManyProjectsUserHasQuery(userID, tx)
		if err != nil {
			log.Default().Println("Error checking user projects:", err)
			return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
		}
		if count >= 5 {
			return uuid.Nil, fiber.StatusForbidden, errors.New("free users can only create up to 5 projects")
		}
	}
	projectID, err := createProjectQuery(projectReq, userID, tx)
	if err != nil {
		log.Default().Println("Error creating project:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}

	if err = tx.Commit(); err != nil {
		log.Default().Println("Error committing transaction:", err)
		return uuid.Nil, fiber.StatusInternalServerError, fmt.Errorf("%w: failed to commit transaction: %v", ErrDatabaseOperation, err)
	}

	return projectID, fiber.StatusCreated, nil
}

func GetProjectsForUserService(userID string, page, limit int, db *sqlx.DB) ([]types.GetProjectsForUserRequest, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}
	offset := (page - 1) * limit

	projects, err := fetUserProjectsQueryWithPaginationQuery(userID, limit, offset, db)
	if err != nil {
		log.Default().Println("Error fetching user projects:", err)
		return nil, fiber.StatusInternalServerError, fmt.Errorf("%w: %v", ErrDatabaseOperation, err)
	}

	return projects, fiber.StatusOK, nil
}
