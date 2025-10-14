package projectsmebers

import (
	"database/sql"
	"errors"
	"time"

	"branchline.me/server/src/services/projects-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

var (
	ErrInviteNotFound    = errors.New("invite not found or invalid")
	ErrInviteExpired     = errors.New("invite expired")
	ErrInviteAlreadyUsed = errors.New("invite already used")
)

// Invite represents a project invite row fetched from DB.

func createProjectMemberInviteQuery(projectID uuid.UUID, inviterID uuid.UUID, role string, tokenHash string, expiresAt *time.Time, db *sqlx.DB) error {
	q := `INSERT INTO project_invites (project_id, token_hash, role, inviter_id, expires_at) VALUES ($1,$2,$3,$4,$5)`
	_, err := db.Exec(q, projectID, tokenHash, role, inviterID, expiresAt)
	if err != nil {
		return err
	}
	return nil
}

func addMmberToProjectQuery(projectID uuid.UUID, userID uuid.UUID, role string, db *sqlx.Tx) error {
	q := `INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`
	_, err := db.Exec(q, projectID, userID, role)
	if err != nil {
		return err
	}
	return nil
}

func markInviteAsUsedQuery(inviteID uuid.UUID, db *sqlx.Tx) error {
	q := `UPDATE project_invites SET used=TRUE WHERE id=$1`
	_, err := db.Exec(q, inviteID)
	if err != nil {
		return err
	}
	return nil
}

// new: fetch invite by token hash, returns typed Invite
func getProjectInviteByHashQuery(tokenHash string, db *sqlx.DB) (types.Invite, error) {
	var inv types.Invite
	q := `SELECT id, project_id, role, expires_at, used FROM project_invites WHERE token_hash=$1`
	err := db.QueryRowx(q, tokenHash).Scan(&inv.ID, &inv.ProjectID, &inv.Role, &inv.ExpiresAt, &inv.Used)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return types.Invite{}, ErrInviteNotFound
		}
		return types.Invite{}, err
	}
	return inv, nil
}
