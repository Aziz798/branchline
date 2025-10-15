package projects

import (
	"log"

	"branchline.me/server/src/services/projects-service/internal/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func createProjectQuery(project types.CreateProjectRequest, userID string, db *sqlx.DB) (uuid.UUID, error) {
	q := `INSERT INTO projects (name, description, start_date, end_date, owner_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`
	q2 := `INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,'owner')`
	var projectID uuid.UUID
	err := db.QueryRow(q, project.Name, project.Description, project.StartDate, project.EndDate, userID).Scan(&projectID)
	if err != nil {
		log.Default().Println("Error inserting project:", err)
		return uuid.Nil, err
	}
	_, err = db.Exec(q2, projectID, userID)
	if err != nil {
		log.Default().Println("Error inserting project member:", err)
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

func fetchProjectWithTasksQuery(projectID string, userID string, db *sqlx.DB) (types.GetProjectWithTAsksRequest, error) {
	var project types.GetProjectWithTAsksRequest
	q := `SELECT id, name, description, start_date, end_date, status FROM projects WHERE id=$1`
	err := db.QueryRowx(q, projectID).Scan(&project.ID, &project.Name, &project.Description, &project.StartDate, &project.EndDate, &project.Status)
	if err != nil {
		return project, err
	}

	tasksQ := `SELECT id, title, description, status, project_id FROM tasks WHERE project_id=$1 AND user_id=$2`
	rows, err := db.Queryx(tasksQ, projectID, userID)
	if err != nil {
		return project, err
	}
	defer rows.Close()

	var tasks []types.OneProjectTasksResponse
	for rows.Next() {
		var task types.OneProjectTasksResponse
		err := rows.StructScan(&task)
		if err != nil {
			return project, err
		}
		tasks = append(tasks, task)
	}
	if err = rows.Err(); err != nil {
		return project, err
	}
	project.Tasks = tasks

	return project, nil
}
