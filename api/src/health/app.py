import json
from datetime import datetime


def lambda_handler(event, context):
    """
    Public health check endpoint
    """

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://gonzalo-munoz.com',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        'body': json.dumps({
            'status': 'healthy',
            'service': 'gonzalo-munoz-api',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'API is running'
        })
    }
