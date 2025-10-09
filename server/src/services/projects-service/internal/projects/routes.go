package projects

import (
	"branchline.me/server/src/libs/go/middleware"
	"branchline.me/server/src/services/projects-service/internal/types"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func RegisterProjectsServiceRoutes(api fiber.Router, db *sqlx.DB) {
	projectsGroup := api.Group("/projects")
	authMiddleware := middleware.AuthenticationMiddleware()
	projectsGroup.Post("/create", authMiddleware, func(c *fiber.Ctx) error {
		return createProjectRoute(c, db)
	})

}

func createProjectRoute(ctx *fiber.Ctx, db *sqlx.DB) error {
	var projectReq types.CreateProjectRequest
	if err := ctx.BodyParser(&projectReq); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request body",
		})
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
