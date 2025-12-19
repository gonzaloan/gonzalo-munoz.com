/**
 * API Client for calling protected endpoints
 * Update API_BASE_URL after deploying the SAM template
 */

const API_BASE_URL = 'https://api.gonzalo-munoz.com';

/**
 * Make authenticated API call
 */
async function callApi(endpoint, method = 'GET', body = null) {
    const idToken = sessionStorage.getItem('idToken');

    if (!idToken) {
        throw new Error('No authentication token found. Please login first.');
    }

    const options = {
        method: method,
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        }
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized. Your session may have expired.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

/**
 * Call hello endpoint (protected)
 */
async function getHello() {
    return await callApi('/hello');
}

/**
 * Call user-info endpoint (protected)
 */
async function getUserInfo() {
    return await callApi('/user-info');
}

/**
 * Call health endpoint (public - no auth required)
 */
async function getHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return await response.json();
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
}

/**
 * Test API connection
 */
async function testApiConnection() {
    try {
        // Test public endpoint
        console.log('Testing public endpoint...');
        const healthData = await getHealth();
        console.log('Health check:', healthData);

        // Test protected endpoint
        console.log('Testing protected endpoint...');
        const helloData = await getHello();
        console.log('Hello response:', helloData);

        // Test user info endpoint
        console.log('Testing user info endpoint...');
        const userInfo = await getUserInfo();
        console.log('User info:', userInfo);

        return {
            success: true,
            message: 'All API tests passed!',
            data: { healthData, helloData, userInfo }
        };
    } catch (error) {
        return {
            success: false,
            message: 'API test failed',
            error: error.message
        };
    }
}
