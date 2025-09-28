package types

type UserRegistrationType struct {
	FirstName       string `json:"first_name" validate:"required" db:"first_name"`
	LastName        string `json:"last_name" validate:"required" db:"last_name"`
	Email           string `json:"email" validate:"required,email" db:"email"`
	Password        string `json:"password" validate:"required,min=8" db:"password"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8,eqfield=Password"`
}
