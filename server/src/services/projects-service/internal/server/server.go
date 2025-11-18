package server

import (
	"branchline.me/server/src/libs/go/database"
	"branchline.me/server/src/libs/go/validations"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
)

type ProjectsServer struct {
	*fiber.App

	db database.Service
}

func New() *ProjectsServer {
	server := &ProjectsServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "branchline-projects-service",
			AppName:      "branchline-projects-service",
			JSONEncoder:  json.Marshal,
			JSONDecoder:  json.Unmarshal,
			ErrorHandler: func(c *fiber.Ctx, err error) error {
				return c.Status(fiber.StatusBadRequest).JSON(validations.GlobalErrorHandlerResp{
					Success: false,
					Message: err.Error(),
				})
			},
		}),

		db: database.New(),
	}
	return server
}
