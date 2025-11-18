package projectsmebers

import (
	"time"

	"branchline.me/server/src/libs/go/middleware"
	"branchline.me/server/src/services/projects-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

func RegisterProjectsMembersRoutes(api fiber.Router, db *sqlx.DB) {
	projectsMembersGroup := api.Group("/project-members")
	authMiddleware := middleware.AuthenticationMiddleware()
	projectsMembersGroup.Post("/invite", authMiddleware, func(c *fiber.Ctx) error {
		return inviteMemberRoute(c, db)
	})

	projectsMembersGroup.Post("/invite/accept", authMiddleware, func(c *fiber.Ctx) error {
		return acceptInviteRoute(c, db)
	})
	projectsMembersGroup.Get("/invites/project/:project_id", authMiddleware, func(c *fiber.Ctx) error {
		return getAllPendingInvitesForProjectRoute(c, db)
	})
}

func inviteMemberRoute(c *fiber.Ctx, db *sqlx.DB) error {
	var r types.AddProjectMemberRequest
	if err := c.BodyParser(&r); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	inviterID := c.Locals("user_id").(string)
	pid, err := uuid.Parse(r.ProjectID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid project_id"})
	}
	expires := time.Duration(r.ExpiresIn) * time.Second
	token, err := createInviteService(pid, uuid.MustParse(inviterID), r.Role, expires, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	// return token to inviter to share (do not log)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"invite_token": token})
}

func acceptInviteRoute(c *fiber.Ctx, db *sqlx.DB) error {
	type req struct {
		Token string `json:"token"`
	}
	var r req
	if err := c.BodyParser(&r); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	userID := c.Locals("user_id").(string)
	if err := acceptInviteService(r.Token, uuid.MustParse(userID), db); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func getAllPendingInvitesForProjectRoute(c *fiber.Ctx, db *sqlx.DB) error {
	var projectID uuid.UUID
	if err := c.ParamsParser(&projectID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid project_id"})
	}

	invites, err := getAllPendingInvitesForProjectService(projectID, db)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"invites": invites})
}
