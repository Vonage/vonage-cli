// https://rest.nexmo.com/account/get-balance
export const getBalance = {
    "value": 10.28,
    "autoReload": false
}
// https://rest.nexmo.com/account/top-up
export const postTopUp200 = {
    "error-code": "200",
    "error-code-label": "success"
}
export const postTopUp401auth = {
  "error-code": "401",
  "error-code-label": "authentication failed"
}
export const postTopUp401auto = {
  "error-code": "401",
  "error-code-label": "not auto-reload enabled"
}
// https://rest.nexmo.com/account/settings
export const postConfiguration = {
    "mo-callback-url": "https://example.com/webhooks/inbound-sms",
    "dr-callback-url": "https://example.com/webhooks/delivery-receipt",
    "max-outbound-request": 30,
    "max-inbound-request": 30,
    "max-calls-per-second": 30
}
// https://api.nexmo.com/accounts/:api_key/secrets
export const getSecrets200 = {
    "_links": {
        "self": {
            "href": "abc123"
        }
    },
    "_embedded": {
        "secrets": [
            {
                "_links": {
                    "self": {
                        "href": "abc123"
                    }
                },
                "id": "ad6dc56f-07b5-46e1-a527-85530e625800",
                "created_at": "2017-03-02T16:34:49Z"
            }
        ]
    }
}

export const getSecrets401 = {
  "type": "https://developer.nexmo.com/",
  "title": "Unauthorized",
  "detail": "Invalid credentials format. Expected: \"Authorization: (Base64(UTF-8(apiKey:secret)))\"",
  "instance": "bf0ca0bf927b3b52e3cb03217e1a1ddf"
}

export const getSecrets404 = {
  "type": "https://developer.nexmo.com/api-errors#invalid-api-key",
  "title": "Invalid API Key",
  "detail": "API key 'abc123' not found",
  "instance": "bf0ca0bf927b3b52e3cb03217e1a1ddf"
}


export const postSecrets = {
    "_links": {
        "self": {
            "href": "abc123"
        }
    },
    "id": "ad6dc56f-07b5-46e1-a527-85530e625800",
    "created_at": "2017-03-02T16:34:49Z"
}


// https://api.nexmo.com/accounts/:api_key/secrets/:secret_id
export const deleteSecret = {

}
