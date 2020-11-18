// https://rest.nexmo.com/account/get-balance
export const getBalance = {
    "value": 10.28,
    "autoReload": false
}
// https://rest.nexmo.com/account/top-up
export const postTopUp = {
    "error-code": "200",
    "error-code-label": "success"
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
export const getSecrets = {
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
export const getSecret = {
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
