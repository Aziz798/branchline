package validations

import (
	"fmt"
	"reflect"
	"strings"
	"unicode"

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
	errs := v.validator.Struct(data)
	if errs == nil {
		return nil
	}

	validationErrors := errs.(validator.ValidationErrors)
	errorMap := make(map[string]struct {
		Errors []string `json:"errors"`
	})
	for _, fieldErr := range validationErrors {
		fieldName := getJSONTag(data, fieldErr.StructField())
		errorMap[fieldName] = struct {
			Errors []string `json:"errors"`
		}{
			Errors: append([]string{}, formatValidationError(fieldErr, data)),
		}
	}

	return errorMap

}

// formatValidationError builds a user-friendly error message for a validation error
func formatValidationError(fe validator.FieldError, data any) string {
	// human readable field name based on json tag
	fieldJSON := getJSONTag(data, fe.StructField())
	human := humanize(fieldJSON)

	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", human)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", human)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters long", human, fe.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters long", human, fe.Param())
	case "len":
		return fmt.Sprintf("%s must be %s characters long", human, fe.Param())
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s", human, fe.Param())
	case "lte":
		return fmt.Sprintf("%s must be less than or equal to %s", human, fe.Param())
	case "eqfield":
		// param is the other struct field name; map it to json tag if possible
		other := getJSONTag(data, fe.Param())
		return fmt.Sprintf("%s must match %s", human, humanize(other))
	default:
		// generic fallback
		return fmt.Sprintf("%s is invalid", human)
	}
}

// humanize converts snake_case json field names into a nicer form: "first_name" -> "First name"
func humanize(s string) string {
	s = strings.ReplaceAll(s, "_", " ")
	if s == "" {
		return s
	}
	// capitalize first rune
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
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
