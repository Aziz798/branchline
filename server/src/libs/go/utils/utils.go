package utils

import (
	"crypto/rand"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func GenerateOTPCode() (string, error) {
	// Generate a 6-digit OTP
	const otpLength = 6
	const digits = "0123456789"

	bytes := make([]byte, otpLength)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}

	for i := 0; i < otpLength; i++ {
		bytes[i] = digits[bytes[i]%byte(len(digits))]
	}

	return string(bytes), nil
}

func HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", fmt.Errorf("error hashing password: %w", err)
	}
	return string(hashed), nil
}

func ComparePassword(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return fmt.Errorf("passwords doesn't match %w", err)
	}
	return nil
}
func HashOTP(otp string) (string, error) {
	// Add timestamp to OTP before hashing for expiration
	timestampedOTP := fmt.Sprintf("%s:%d", otp, time.Now().Unix())
	return HashPassword(timestampedOTP)
}

func VerifyOTP(hashedOTP, plainOTP string) error {
	const otpValidityMinutes = 10

	// We need to try different timestamps within the validity window
	// since we don't know the exact timestamp when the OTP was created
	currentTime := time.Now().Unix()

	// Try timestamps from now back to the validity window
	for i := int64(0); i <= otpValidityMinutes*60; i++ {
		testTimestamp := currentTime - i
		timestampedOTP := fmt.Sprintf("%s:%d", plainOTP, testTimestamp)

		err := bcrypt.CompareHashAndPassword([]byte(hashedOTP), []byte(timestampedOTP))
		if err == nil {
			// Found a match, now check if it's within the validity window
			otpAge := currentTime - testTimestamp
			if otpAge <= otpValidityMinutes*60 {
				return nil // Valid OTP within time window
			}
			return fmt.Errorf("OTP has expired")
		}
	}

	return fmt.Errorf("invalid OTP")
}

func VerifyPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
