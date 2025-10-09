package utils

import (
	"crypto/rand"
	"fmt"
	"strconv"
	"strings"
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
	// Store timestamp and hashed OTP separately using a delimiter
	timestamp := time.Now().Unix()
	hashedOTP, err := bcrypt.GenerateFromPassword([]byte(otp), 12)
	if err != nil {
		return "", fmt.Errorf("error hashing OTP: %w", err)
	}
	// Format: timestamp:hashedOTP
	return fmt.Sprintf("%d:%s", timestamp, string(hashedOTP)), nil
}

func VerifyOTP(storedData, plainOTP string) error {
	const otpValidityMinutes = 10

	// Parse the stored data: timestamp:hashedOTP
	parts := strings.SplitN(storedData, ":", 2)
	if len(parts) != 2 {
		return fmt.Errorf("invalid stored OTP format")
	}

	timestampStr, hashedOTP := parts[0], parts[1]

	// Parse the timestamp
	otpTimestamp, err := strconv.ParseInt(timestampStr, 10, 64)
	if err != nil {
		return fmt.Errorf("invalid OTP timestamp: %w", err)
	}

	// Check if OTP has expired
	currentTime := time.Now().Unix()
	otpAge := currentTime - otpTimestamp
	if otpAge > otpValidityMinutes*60 {
		return fmt.Errorf("OTP has expired")
	}

	// Verify the OTP (only one bcrypt operation!)
	err = bcrypt.CompareHashAndPassword([]byte(hashedOTP), []byte(plainOTP))
	if err != nil {
		return fmt.Errorf("invalid OTP")
	}

	return nil
}

func VerifyPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
