package validations

import (
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Validator interface defines the contract for validation
type Validator interface {
	Validate(data any) []string
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
func (v *xValidator) Validate(data any) []string {
	validationErrors := []string{}

	errs := v.validator.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			// Get the JSON tag name instead of the field name
			jsonTag := getJSONTag(data, err.Field())
			validationErrors = append(validationErrors, jsonTag)
		}
	}

	return validationErrors
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
