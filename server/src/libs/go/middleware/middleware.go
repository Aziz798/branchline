package middleware

import (
	"strings"

	"branchline.me/server/src/libs/go/utils"
	"github.com/gofiber/fiber/v2"
)

func AuthenticationMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check for Authorization header
		tokenString := c.Get("Authorization")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing authentication token"})
		}

		// The token should be prefixed with "Bearer "
		tokenParts := strings.Split(tokenString, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid authentication token"})
		}

		tokenString = tokenParts[1]

		// Verify access token
		claims, err := utils.VerifyToken(tokenString, false)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token, refresh token required"})
		}
		// Set user ID from the token in the context
		c.Locals("user_id", claims["user_id"].(string))
		// Set user role from the token in the context
		c.Locals("user_role", claims["user_role"])
		// Continue to the next middleware or handler
		c.Locals("is_premium", claims["is_premium"])
		c.Locals("is_active", claims["is_active"])
		return c.Next()
	}
}
