package types

import (
	"time"

	"github.com/google/uuid"
)

type AddProjectMemberRequest struct {
	ProjectID string `json:"project_id" validate:"required,uuid4" db:"project_id"`
	Role      string `json:"role" validate:"required,oneof=member admin owner" db:"role"`
	ExpiresIn int64  `json:"expires_in_seconds" validate:"omitempty" db:"expires_in_seconds"` // optional
}

type Invite struct {
	ID        uuid.UUID
	ProjectID uuid.UUID
	Role      string
	ExpiresAt *time.Time
	Used      bool
}
