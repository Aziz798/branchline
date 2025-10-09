package projects

import (
	"branchline.me/server/src/libs/go/validations"
	"branchline.me/server/src/services/projects-service/internal/types"
)

var v = validations.GetGlobalValidator()

func ValidateCreateProject(project types.CreateProjectRequest) interface{} {
	errors := v.Validate(project)
	if errors != nil {
		return errors
	}
	return nil
}
