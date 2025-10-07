package validations

import (
	"reflect"
	"strings"

	"github.com/go-playground/locales/fr"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
)

// Validator interface defines the contract for validation
type Validator interface {
	Validate(data any) interface{}
}

// xValidator implements the Validator interface using a global validator instance
type xValidator struct {
	validator *validator.Validate
}

// GlobalErrorHandlerResp represents the structure for global error handling responses
type GlobalErrorHandlerResp struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// Create a global validator instance
var globalValidator = &xValidator{
	validator: validator.New(validator.WithRequiredStructEnabled()),
}

// Validate validates the given data using the global validator instance
func (v *xValidator) Validate(data any) interface{} {
	uni := ut.New(fr.New(), fr.New())
	trans, _ := uni.GetTranslator("fr")
	errs := v.validator.Struct(data)
	if errs != nil {
		return errs.(validator.ValidationErrors).Translate(trans)
	}

	return nil
}

// getJSONTag extracts the JSON tag name from the struct field
func getJSONTag(data any, fieldName string) string {
	dataType := reflect.TypeOf(data)

	// Handle pointer types
	if dataType.Kind() == reflect.Ptr {
		dataType = dataType.Elem()
	}

	field, found := dataType.FieldByName(fieldName)
	if !found {
		return fieldName // fallback to field name if not found
	}

	jsonTag := field.Tag.Get("json")
	if jsonTag == "" {
		return fieldName // fallback to field name if no json tag
	}

	// Handle cases like `json:"email,omitempty"`
	if idx := strings.Index(jsonTag, ","); idx != -1 {
		jsonTag = jsonTag[:idx]
	}

	return jsonTag
}

// GetGlobalValidator returns the global validator instance
func GetGlobalValidator() Validator {
	return globalValidator
}
