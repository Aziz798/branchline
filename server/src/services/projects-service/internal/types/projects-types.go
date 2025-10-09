package types

import "time"

type CreateProjectRequest struct {
	Name        string    `json:"name" validate:"required,min=3,max=100"`
	Description string    `json:"description" validate:"max=500"`
	StartDate   time.Time `json:"start_date" vaildate:"required"`
	EndDate     time.Time `json:"start_date" vaildate:"required"`
}
