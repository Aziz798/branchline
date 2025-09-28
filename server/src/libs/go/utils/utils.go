package utils

import (
	"crypto/rand"
	"fmt"
	"math/big"

	"golang.org/x/crypto/bcrypt"
)

func GenerateOTPCode() (string, error) {
	seed := "012345679"
	byteSlice := make([]byte, 6)

	for i := 0; i < 6; i++ {
		max := big.NewInt(int64(len(seed)))
		num, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}

		byteSlice[i] = seed[num.Int64()]
	}

	return string(byteSlice), nil

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
	// Using a lighter work factor than passwords since OTPs are temporary
	hashed, err := bcrypt.GenerateFromPassword([]byte(otp), 10)
	if err != nil {
		return "", fmt.Errorf("error hashing OTP: %w", err)
	}
	return string(hashed), nil
}

func VerifyOTP(hashedOTP, providedOTP string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedOTP), []byte(providedOTP))
	if err != nil {
		return fmt.Errorf("invalid OTP: %w", err)
	}
	return nil
}
