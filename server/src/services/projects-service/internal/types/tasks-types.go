package types

type OneProjectTasksResponse struct {
	ID          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	Status      string `json:"status" db:"status"`
	ProjectID   string `json:"project_id" db:"project_id"`
}
