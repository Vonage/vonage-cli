const genericSuccess = {
    'error-code': '200',
    'error-code-label': 'success',
}

const genericAuthError = {
    'error-code': '401',
    'error-code-label': 'authentication failed',
}

const genericFailedError = {
    'error-code': '420',
    'error-code-label': 'method failed',
}

const countryErrorResponse = {
    'error-code': '420',
    'error-code-label': `Numbers from this country can be requested from the Dashboard (https://dashboard.nexmo.com/buy-numbers) as they require a valid local address to be provided before being purchased.`,
}

module.exports = {
    genericSuccess,
    genericAuthError,
    genericFailedError,
    countryErrorResponse,
}
