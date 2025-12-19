// Cognito Configuration
const COGNITO_CONFIG = {
    userPoolId: 'us-east-1_XG4v2RPEk',
    clientId: '6pu52ka70282s0sduko24ufd3',
    domain: 'https://us-east-1xg4v2rpek.auth.us-east-1.amazoncognito.com',
    region: 'us-east-1',
    redirectUri: 'https://gonzalo-munoz.com/logged.html'
};

// Build Cognito Hosted UI login URL
function getCognitoLoginUrl() {
    const params = new URLSearchParams({
        client_id: COGNITO_CONFIG.clientId,
        response_type: 'code',
        scope: 'openid email profile',
        redirect_uri: COGNITO_CONFIG.redirectUri
    });

    return `${COGNITO_CONFIG.domain}/login?${params.toString()}`;
}

// Build Cognito logout URL
function getCognitoLogoutUrl() {
    const params = new URLSearchParams({
        client_id: COGNITO_CONFIG.clientId,
        logout_uri: 'https://gonzalo-munoz.com/index.html'
    });

    return `${COGNITO_CONFIG.domain}/logout?${params.toString()}`;
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
