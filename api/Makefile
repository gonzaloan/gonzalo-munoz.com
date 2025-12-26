.PHONY: build clean deploy test

build:
	sam build

clean:
	rm -rf .aws-sam

deploy:
	sam deploy

test-local:
	sam local start-api

invoke-hello:
	sam local invoke HelloFunction

invoke-health:
	sam local invoke HealthCheckFunction

invoke-user-info:
	sam local invoke UserInfoFunction
