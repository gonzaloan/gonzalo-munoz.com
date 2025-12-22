// Cognito Configuration
const COGNITO_CONFIG = {
    userPoolId: 'us-east-1_XG4v2RPEk',
    clientId: '7a9riqnf3fj8a3s4kc6juk7f6c',
    domain: 'https://gonzalo-auth-2025.auth.us-east-1.amazoncognito.com',
    region: 'us-east-1',
    isCustomDomain: false
};

// Get redirect URI based on current location
function getRedirectUri() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://${window.location.host}/logged.html`;
    }
    return 'https://gonzalo-munoz.com/logged.html';
}

// Get logout URI based on current location
function getLogoutUri() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://${window.location.host}/index.html`;
    }
    return 'https://gonzalo-munoz.com/index.html';
}

// Build Cognito Hosted UI login URL
function getCognitoLoginUrl() {
    const params = new URLSearchParams({
        client_id: COGNITO_CONFIG.clientId,
        response_type: 'code',
        scope: 'email openid',
        redirect_uri: getRedirectUri()
    });

    // Custom domains require OAuth2 endpoints
    const endpoint = COGNITO_CONFIG.isCustomDomain ? '/oauth2/authorize' : '/login';
    return `${COGNITO_CONFIG.domain}${endpoint}?${params.toString()}`;
}

// Build Cognito logout URL
function getCognitoLogoutUrl() {
    const params = new URLSearchParams({
        client_id: COGNITO_CONFIG.clientId,
        logout_uri: getLogoutUri()
    });

    // Custom domains require OAuth2 endpoints
    const endpoint = COGNITO_CONFIG.isCustomDomain ? '/oauth2/logout' : '/logout';
    return `${COGNITO_CONFIG.domain}${endpoint}?${params.toString()}`;
}

// Redirect to Cognito login
function loginWithCognito() {
    window.location.href = getCognitoLoginUrl();
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = getCognitoLogoutUrl();
}
