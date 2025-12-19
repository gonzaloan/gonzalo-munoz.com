import json


def lambda_handler(event, context):
    """
    Protected endpoint that returns detailed user information from Cognito JWT claims
    """

    try:
        # Extract all claims from the Cognito authorizer
        claims = event['requestContext']['authorizer']['claims']

        user_data = {
            'sub': claims.get('sub'),
            'email': claims.get('email'),
            'email_verified': claims.get('email_verified'),
            'username': claims.get('cognito:username'),
            'token_use': claims.get('token_use'),
            'auth_time': claims.get('auth_time'),
            'iss': claims.get('iss'),
            'exp': claims.get('exp'),
            'iat': claims.get('iat')
        }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://gonzalo-munoz.com',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'success': True,
                'user': user_data,
                'message': 'User information retrieved successfully'
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://gonzalo-munoz.com'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'message': 'Failed to retrieve user information'
            })
        }
