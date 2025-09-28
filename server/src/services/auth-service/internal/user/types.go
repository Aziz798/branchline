package user

import (
	"log"

	"branchline.me/server/src/libs/go/utils"
	"github.com/jackc/pgx/v5/pgtype"
)

// TokenPair represents a pair of access and refresh tokens
type TokenPair struct {
	Token        string
	RefreshToken string
}

// OTPRequest represents the request structure for OTP verification
type OTPRequest struct {
	Code string `json:"code" validate:"required,min=6,max=6"`
}

// GenerateUserTokens generates tokens for a new (unverified) user
func GenerateUserTokens(userId string, isVerified bool) (TokenPair, error) {
	var tokens TokenPair
	var uuid pgtype.UUID
	if err := uuid.Scan(userId); err != nil {
		log.Printf("error converting userId to UUID: %s", err.Error())
		return tokens, err
	}

	token, refreshToken, err := utils.GenerateToken(uuid, "user", false, isVerified)
	if err != nil {
		log.Printf("error generating token: %s", err.Error())
		return tokens, err
	}

	tokens.Token = token
	tokens.RefreshToken = refreshToken
	return tokens, nil
}

// GenerateVerifiedUserTokens generates tokens for a verified user
func GenerateVerifiedUserTokens(userID, userRole string, isPremium bool) (TokenPair, error) {
	var tokens TokenPair
	var uuid pgtype.UUID
	if err := uuid.Scan(userID); err != nil {
		log.Printf("error converting userId to UUID: %s", err.Error())
		return tokens, err
	}

	token, refreshToken, err := utils.GenerateToken(uuid, userRole, isPremium, true)
	if err != nil {
		log.Printf("error generating token: %s", err.Error())
		return tokens, err
	}

	tokens.Token = token
	tokens.RefreshToken = refreshToken
	return tokens, nil
}
