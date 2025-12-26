
package main

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type User struct {
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Username      string `json:"username"`
	TokenUse      string `json:"token_use"`
	AuthTime      string `json:"auth_time"`
	Iss           string `json:"iss"`
	Exp           string `json:"exp"`
	Iat           string `json:"iat"`
}

type SuccessResponse struct {
	Success bool   `json:"success"`
	User    User   `json:"user"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Message string `json:"message"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Try to extract claims - they might be directly in Authorizer or nested under "claims"
	var claims map[string]interface{}

	// First try nested claims
	if claimsNested, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{}); ok {
		claims = claimsNested
	} else {
		// If not nested, use the Authorizer map directly as claims
		claims = request.RequestContext.Authorizer
	}

	if len(claims) == 0 {
		errorBody, _ := json.Marshal(ErrorResponse{
			Success: false,
			Error:   "Claims not found",
			Message: "Failed to retrieve user information",
		})

		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Content-Type":                "application/json",
				"Access-Control-Allow-Origin": "https://gonzalo-munoz.com",
			},
			Body: string(errorBody),
		}, nil
	}

	// Build user data
	userData := User{
		Sub:           getClaimString(claims, "sub"),
		Email:         getClaimString(claims, "email"),
		EmailVerified: getClaimString(claims, "email_verified"),
		Username:      getClaimString(claims, "cognito:username"),
		TokenUse:      getClaimString(claims, "token_use"),
		AuthTime:      getClaimString(claims, "auth_time"),
		Iss:           getClaimString(claims, "iss"),
		Exp:           getClaimString(claims, "exp"),
		Iat:           getClaimString(claims, "iat"),
	}

	responseBody := SuccessResponse{
		Success: true,
		User:    userData,
		Message: "User information retrieved successfully",
	}

	body, _ := json.Marshal(responseBody)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "https://gonzalo-munoz.com",
			"Access-Control-Allow-Headers": "Content-Type,Authorization",
			"Access-Control-Allow-Methods": "GET,OPTIONS",
		},
		Body: string(body),
	}, nil
}

func getClaimString(claims map[string]interface{}, key string) string {
	if val, ok := claims[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return ""
}

func main() {
	lambda.Start(handler)
}
