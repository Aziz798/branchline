package server

import (
	"branchline.me/server/src/libs/go/database"
	"branchline.me/server/src/libs/go/validations"
	"branchline.me/server/src/services/auth-service/internal/oauth"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
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

	// Initialize OAuth configuration
	oauth.GoogleConfig()

	return server
}
