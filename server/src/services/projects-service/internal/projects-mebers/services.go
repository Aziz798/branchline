package projectsmebers

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// CreateInvite inserts invite and returns plaintext token to send to inviter.
func createInviteService(projectID uuid.UUID, inviterID uuid.UUID, role string, expiresIn time.Duration, db *sqlx.DB) (string, error) {
	token, err := generateInviteToken(32)
	if err != nil {
		return "", err
	}
	tokenHash := hashInviteToken(token)

	var expiresAt *time.Time
	if expiresIn > 0 {
		t := time.Now().Add(expiresIn)
		expiresAt = &t
	}

	// use pointer-aware query to avoid nil deref
	err = createProjectMemberInviteQuery(projectID, inviterID, role, tokenHash, expiresAt, db)
	if err != nil {
		return "", err
	}
	return token, nil
}

// AcceptInvite verifies token and creates a collaborator row for userID.
func acceptInviteService(token string, userID uuid.UUID, db *sqlx.DB) error {
	tokenHash := hashInviteToken(token)

	// fetch invite before starting a TX
	invite, err := getProjectInviteByHashQuery(tokenHash, db)
	if err != nil {
		return err
	}
	if invite.Used {
		return ErrInviteAlreadyUsed
	}
	if invite.ExpiresAt != nil && time.Now().After(*invite.ExpiresAt) {
		return ErrInviteExpired
	}

	tx, err := db.Beginx()
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			tx.Rollback()
		}
	}()

	err = addMmberToProjectQuery(invite.ProjectID, userID, invite.Role, tx)
	if err != nil {
		return err
	}

	// Mark invite used
	err = markInviteAsUsedQuery(invite.ID, tx)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}
	return nil
}
