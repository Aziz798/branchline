package projects

import (
	"branchline.me/server/src/services/projects-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createProjectQuery(project types.CreateProjectRequest, userID string, db *sqlx.Tx) (uuid.UUID, error) {
	q := `INSERT INTO projects (name, description, start_date, end_date, owner_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`
	q2 := `INSERT INTO project_members (project_id, user_id, role, inviter_id) VALUES ($1,$2,'owner',$2)`
	var projectID uuid.UUID
	err := db.QueryRow(q, project.Name, project.Description, project.StartDate, project.EndDate, userID).Scan(&projectID)
	if err != nil {
		return uuid.Nil, err
	}
	_, err = db.Exec(q2, projectID, userID)
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

// Fetch user projects with pagination and nummber of pages
func fetUserProjectsQueryWithPaginationQuery(userID string, limit, offset int, db *sqlx.DB) ([]types.GetProjectsForUserRequest, error) {
	q := `SELECT id, name, description, start_date, end_date, owner_id, created_at, updated_at,status,
		CEIL(COUNT(*) OVER()::DECIMAL / $2) AS number_of_pages
		FROM projects
		WHERE owner_id=$1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`
	rows, err := db.Queryx(q, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []types.GetProjectsForUserRequest
	for rows.Next() {
		var project types.GetProjectsForUserRequest
		err := rows.StructScan(&project)
		if err != nil {
			return nil, err
		}
		projects = append(projects, project)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return projects, nil
}
