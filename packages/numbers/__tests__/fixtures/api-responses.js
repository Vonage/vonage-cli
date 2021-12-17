const baseHost = 'https://rest.nexmo.com/number'

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

const keysOnlyBody = {
    api_key: process.env.VONAGE_API_KEY,
    api_secret: process.env.VONAGE_API_SECRET,
}
const searchBody = {
    country: 'GB',
    ...keysOnlyBody,
}

const genericBody = {
    msisdn: '447700900000',
    ...searchBody,
}

const emptySearchResponse = {
    count: 0,
    numbers: [],
}

let searchOutput = ` Country Number       Type       Cost Features      
 ─────── ──────────── ────────── ──── ───────────── 
 GB      447700900000 mobile-lvn 1.25 VOICE,SMS,MMS 
 GB      447700900001 mobile-lvn 1.25 VOICE,SMS,MMS 
 GB      447700900002 mobile-lvn 1.25 VOICE,SMS,MMS 
 GB      447700900003 mobile-lvn 1.25 VOICE,SMS,MMS \n`

let numbersOutput = ` Country Number       Type       Features      Application 
 ─────── ──────────── ────────── ───────────── ─────────── 
 GB      447700900000 mobile-lvn VOICE,SMS,MMS             \n`

const numbersResponse = {
    count: 1,
    numbers: [
        {
            country: 'GB',
            msisdn: '447700900000',
            moHttpUrl: 'https://example.com/webhooks/inbound-sms',
            type: 'mobile-lvn',
            features: ['VOICE', 'SMS', 'MMS'],
            messagesCallbackType: 'app',
            messagesCallbackValue: 'aaaaaaaa-bbbb-cccc-dddd-0123456789ab',
            voiceCallbackType: 'app',
            voiceCallbackValue: 'aaaaaaaa-bbbb-cccc-dddd-0123456789ab',
        },
    ],
}

const searchResponse = {
    count: 4,
    numbers: [
        {
            country: 'GB',
            msisdn: '447700900000',
            type: 'mobile-lvn',
            cost: '1.25',
            features: ['VOICE', 'SMS', 'MMS'],
        },
        {
            country: 'GB',
            msisdn: '447700900001',
            type: 'mobile-lvn',
            cost: '1.25',
            features: ['VOICE', 'SMS', 'MMS'],
        },
        {
            country: 'GB',
            msisdn: '447700900002',
            type: 'mobile-lvn',
            cost: '1.25',
            features: ['VOICE', 'SMS', 'MMS'],
        },
        {
            country: 'GB',
            msisdn: '447700900003',
            type: 'mobile-lvn',
            cost: '1.25',
            features: ['VOICE', 'SMS', 'MMS'],
        },
    ],
}

module.exports = {
    baseHost,
    genericSuccess,
    genericAuthError,
    genericFailedError,
    countryErrorResponse,
    genericBody,
    emptySearchResponse,
    searchBody,
    searchOutput,
    searchResponse,
    numbersResponse,
    numbersOutput,
    keysOnlyBody,
}
