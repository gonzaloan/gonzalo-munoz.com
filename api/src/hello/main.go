package main

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type UserInfo struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Sub      string `json:"sub"`
}

type Response struct {
	Message   string   `json:"message"`
	UserInfo  UserInfo `json:"userInfo"`
	Timestamp string   `json:"timestamp"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Handle OPTIONS request for CORS preflight
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "https://gonzalo-munoz.com",
				"Access-Control-Allow-Methods": "GET,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type,Authorization",
			},
			Body: "",
		}, nil
	}

	// Get user info from Cognito authorizer claims
	claims := request.RequestContext.Authorizer["claims"].(map[string]interface{})

	email := getClaimString(claims, "email", "Unknown")
	username := getClaimString(claims, "cognito:username", "Unknown")
	sub := getClaimString(claims, "sub", "Unknown")

	// Build response
	responseBody := Response{
		Message: "Hello, " + email + "!",
		UserInfo: UserInfo{
			Email:    email,
			Username: username,
			Sub:      sub,
		},
		Timestamp: request.RequestContext.RequestID,
	}

	body, _ := json.Marshal(responseBody)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "https://gonzalo-munoz.com",
			"Access-Control-Allow-Headers": "Content-Type,Authorization",
			"Access-Control-Allow-Methods": "GET,OPTIONS",
		},
		Body: string(body),
	}, nil
}

func getClaimString(claims map[string]interface{}, key string, defaultValue string) string {
	if val, ok := claims[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return defaultValue
}

func main() {
	lambda.Start(handler)
}
