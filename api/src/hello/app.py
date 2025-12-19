import json
import os


def lambda_handler(event, context):
    """
    Protected Lambda function that returns a hello message.
    The user info is available in the event['requestContext']['authorizer']['claims']
    """

    # Get user info from Cognito authorizer
    try:
        claims = event['requestContext']['authorizer']['claims']
        email = claims.get('email', 'Unknown')
        username = claims.get('cognito:username', 'Unknown')
        sub = claims.get('sub', 'Unknown')
    except KeyError:
        email = 'Unknown'
        username = 'Unknown'
        sub = 'Unknown'

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://gonzalo-munoz.com',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        'body': json.dumps({
            'message': f'Hello, {email}!',
            'userInfo': {
                'email': email,
                'username': username,
                'sub': sub
            },
            'timestamp': context.request_id
        })
    }
