package projects

import (
	"encoding/json"
	"log"
	"time"

	"branchline.me/server/src/libs/go/middleware"
	"branchline.me/server/src/services/projects-service/internal/types"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jmoiron/sqlx"
)

func RegisterProjectsServiceRoutes(api fiber.Router, db *sqlx.DB) {
	projectsGroup := api.Group("/projects")
	authMiddleware := middleware.AuthenticationMiddleware()
	projectsGroup.Post("/create", authMiddleware, func(c *fiber.Ctx) error {
		return createProjectRoute(c, db)
	})
	projectsGroup.Get("/user", authMiddleware, func(c *fiber.Ctx) error {
		return getProjectsForUserRoute(c, db)
	})
	projectsGroup.Get("/:project_id", authMiddleware, func(c *fiber.Ctx) error {
		return getProjectWithTasksRoute(c, db)
	})
}

func createProjectRoute(ctx *fiber.Ctx, db *sqlx.DB) error {
	// intermediate raw request that expects date strings
	var raw struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		StartDate   string `json:"start_date"`
		EndDate     string `json:"end_date"`
	}

	if err := json.Unmarshal(ctx.Body(), &raw); err != nil {
		log.Default().Println("Error parsing request body:", err, string(ctx.Body()))
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
	}

	// parse RFC3339Nano then fallback to RFC3339
	parseTime := func(s string) (time.Time, error) {
		if s == "" {
			return time.Time{}, nil
		}
		var t time.Time
		var err error
		formats := []string{time.RFC3339Nano, time.RFC3339}
		for _, f := range formats {
			t, err = time.Parse(f, s)
			if err == nil {
				return t, nil
			}
		}
		return time.Time{}, err
	}

	startT, err := parseTime(raw.StartDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid start_date format",
			"error":   err.Error(),
		})
	}
	endT, err := parseTime(raw.EndDate)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid end_date format",
			"error":   err.Error(),
		})
	}

	// build the actual request expected by service (uses pgtype.Timestamptz)
	var projectReq types.CreateProjectRequest
	projectReq.Name = raw.Name
	projectReq.Description = raw.Description
	if !startT.IsZero() {
		projectReq.StartDate = pgtype.Timestamptz{Time: startT, Valid: true}
	} else {
		projectReq.StartDate = pgtype.Timestamptz{Valid: false}
	}
	if !endT.IsZero() {
		projectReq.EndDate = pgtype.Timestamptz{Time: endT, Valid: true}
	} else {
		projectReq.EndDate = pgtype.Timestamptz{Valid: false}
	}

	if validationErrors := ValidateCreateProject(projectReq); validationErrors != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
	}

	userID := ctx.Locals("user_id").(string)
	isPremium := ctx.Locals("is_premium").(bool)
	projectID, statusCode, err := createProjectService(projectReq, userID, isPremium, db)
	if err != nil {
		return ctx.Status(statusCode).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(statusCode).JSON(fiber.Map{
		"message":    "Project created successfully",
		"project_id": projectID,
	})
}

func getProjectsForUserRoute(ctx *fiber.Ctx, db *sqlx.DB) error {
	userID := ctx.Locals("user_id").(string)

	page := ctx.QueryInt("page", 1)
	limit := ctx.QueryInt("limit", 10)
	projects, statusCode, err := GetProjectsForUserService(userID, page, limit, db)
	if err != nil {
		return ctx.Status(statusCode).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(statusCode).JSON(fiber.Map{
		"projects": projects,
	})
}

func getProjectWithTasksRoute(ctx *fiber.Ctx, db *sqlx.DB) error {
	userID := ctx.Locals("user_id").(string)
	projectID := ctx.Params("project_id")
	if projectID == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "project_id is required",
		})
	}

	project, statusCode, err := GetProjectWithTasksService(projectID, userID, db)
	if err != nil {
		return ctx.Status(statusCode).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(statusCode).JSON(fiber.Map{
		"project": project,
	})
}
