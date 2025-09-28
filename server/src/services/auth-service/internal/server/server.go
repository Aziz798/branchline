package server

import (
	"github.com/gofiber/fiber/v2"

	"branchline.me/server/src/libs/go/database"
	"branchline.me/server/src/libs/go/validations"
)

type AuthServer struct {
	*fiber.App

	db database.Service
}

func New() *AuthServer {
	server := &AuthServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "branchline-auth-service",
			AppName:      "branchline-auth-service",
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
