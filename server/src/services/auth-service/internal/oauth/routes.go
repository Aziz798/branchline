package oauth

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"branchline.me/server/src/services/auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
)

func GoogleLogin(c *fiber.Ctx) error {
	// Generate secure state
	state, err := generateState()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate state",
		})
	}

	// TODO: Store state in session/redis for validation in callback
	// For now, we'll use the generated state
	url := AppConfig.GoogleLoginConfig.AuthCodeURL(state)

	// For API requests, return JSON with the URL
	if c.Get("Accept") == "application/json" || c.Query("json") == "true" {
		return c.JSON(fiber.Map{
			"redirect_url": url,
			"state":        state,
		})
	}

	// For browser requests, perform redirect
	return c.Redirect(url, fiber.StatusSeeOther)
}

// GoogleCallback handles the OAuth callback from Google
func GoogleCallback(c *fiber.Ctx, db *sqlx.DB) error {
	code := c.Query("code")
	state := c.Query("state")

	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Authorization code not provided",
		})
	}

	if state == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "State parameter missing",
		})
	}

	// TODO: Validate state against stored value

	// Exchange code for token
	token, err := AppConfig.GoogleLoginConfig.Exchange(c.Context(), code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to exchange token: %v", err),
		})
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return c.SendString("User Data Fetch Failed")
	}
	var user types.GoogleOauthUser
	defer resp.Body.Close()
	userData, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.SendString("JSON Parsing Failed")
	}
	err = json.Unmarshal(userData, &user)
	if err != nil {
		return c.SendString("JSON Unmarshal Failed")
	}
	//userID, status, err := registerUserWithGoogleService(user, db)

	log.Default().Println(user)
	return c.SendString("Login Successful" + user.Email)
}
