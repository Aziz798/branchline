package server

import (
	"os"
	"time"

	"branchline.me/server/src/services/projects-service/internal/projects"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/idempotency"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/recover"
	_ "github.com/joho/godotenv/autoload"
)

func (s *ProjectsServer) RegisterProjectsServiceRoutes() {
	api := s.App.Group("projects-service/api/v1/")
	clientUrl := os.Getenv("CLIENT_URL")
	if clientUrl == "" {
		clientUrl = "http://localhost:5173"
	}
	api.Use(cors.New(cors.Config{
		AllowOrigins:     clientUrl,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Idempotency-Key,X-Cache",
		AllowMethods:     "GET,POST,OPTIONS,PUT,DELETE",
		AllowCredentials: true,
	}))
	api.Use(logger.New(logger.Config{
		Format: "\n[${time}] | [${status}] | [${method}] ${path}\n" +
			"Received: ${bytesReceived} bytes | Sent: ${bytesSent} bytes | " +
			"Latency: ${latency} | IP: ${ip} | Error: ${error}\n",
	}))

	api.Use(recover.New(recover.ConfigDefault))
	api.Use(helmet.New(helmet.ConfigDefault))
	api.Get("/api/metrics", monitor.New(monitor.Config{Title: " Branchline Server Page"}))

	api.Use(idempotency.New(idempotency.ConfigDefault))
	api.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Too many requests, please try again later",
			})
		},
		SkipFailedRequests:     false,
		SkipSuccessfulRequests: false,
	}))
	projects.RegisterProjectsServiceRoutes(api, s.db.DB())
}
