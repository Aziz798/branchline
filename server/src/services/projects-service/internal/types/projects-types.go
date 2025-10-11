package types

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type CreateProjectRequest struct {
	Name        string      `json:"name" validate:"required,min=3,max=100" db:"name"`
	Description string      `json:"description" validate:"max=500" db:"description"`
	StartDate   pgtype.Time `json:"start_date" vaildate:"required" db:"start_date"`
	EndDate     pgtype.Time `json:"end_date" vaildate:"required" db:"end_date"`
}

type GetProjectsForUserRequest struct {
	Name          string      `json:"name" db:"name"`
	OwnerID       string      `json:"owner_id" db:"owner_id"`
	ID            string      `json:"id" db:"id"`
	Description   string      `json:"description" db:"description"`
	StartDate     pgtype.Time `json:"start_date" db:"start_date"`
	EndDate       pgtype.Time `json:"end_date" db:"end_date"`
	CreatedAt     pgtype.Time `json:"created_at" db:"created_at"`
	UpdatedAt     pgtype.Time `json:"updated_at" db:"updated_at"`
	NumberOfPages int         `json:"number_of_pages" db:"number_of_pages"`
	Status        string      `json:"status" db:"status"`
}
