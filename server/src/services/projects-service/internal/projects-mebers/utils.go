package projectsmebers

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func generateInviteToken(nBytes int) (string, error) {
	b := make([]byte, nBytes)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	// URL-safe token
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func hashInviteToken(token string) string {
	secret := os.Getenv("INVITE_TOKEN_SECRET")
	if secret == "" {
		secret = os.Getenv("JWT_SECRET_KEY") // fallback
	}
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(token))
	return fmt.Sprintf("%x", h.Sum(nil))
}
