package projects

import (
	"branchline.me/server/src/services/projects-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createProjectQuery(project types.CreateProjectRequest, userID string, db *sqlx.Tx) (uuid.UUID, error) {
	q := `INSERT INTO projects (name, description, start_date, end_date, owner_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`
	var projectID uuid.UUID
	err := db.QueryRow(q, project.Name, project.Description, project.StartDate, project.EndDate, userID).Scan(&projectID)
	if err != nil {
		return uuid.Nil, err
	}
	return projectID, nil

}

func checkHowManyProjectsUserHasQuery(userID string, db *sqlx.Tx) (int, error) {
	q := `SELECT COUNT(*) FROM projects WHERE owner_id=$1`
	var count int
	err := db.QueryRow(q, userID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
