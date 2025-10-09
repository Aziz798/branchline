package types

type UserRegistrationType struct {
	Name            string `json:"name" validate:"required,min=2,max=100"`
	Email           string `json:"email" validate:"required,email" db:"email"`
	Password        string `json:"password" validate:"required,min=8" db:"password"`
	ConfirmPassword string `json:"confirm_password" validate:"required,min=8,eqfield=Password"`
}

type Tokens struct {
	AccessToken  string `json:"token"`
	RefreshToken string `json:"refresh_token"`
}

type GoogleOauthUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Picture       string `json:"picture"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
}
