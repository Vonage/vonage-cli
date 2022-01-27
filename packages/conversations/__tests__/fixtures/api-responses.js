const baseHost = 'https://api.nexmo.com/v0.3'

const genericFailedError = {
    title: 'Bad request.',
    type: 'https://developer.nexmo.com/api/conversation#http:error:validation-fail',
    code: 'http:error:validation-fail',
    detail: 'Input validation failure.',
    instance: '00a5916655d650e920ccf0daf40ef4ee',
    invalid_parameters: [
        {
            name: 'date_start',
            reason: '"date_start" must be a valid ISO 8601 date',
        },
    ],
}

const genericAuthError = {
    title: 'Unauthorized.',
    type: 'https://developer.nexmo.com/api/conversation#system:error:invalid-token',
    code: 'system:error:invalid-token',
    detail: 'You did not provide a valid token. Please provide a valid token.',
    instance: '00a5916655d650e920ccf0daf40ef4ee',
}

const notFoundError = {
    title: 'Not found.',
    type: 'https://developer.nexmo.com/api/conversation#conversation:error:not-found',
    code: 'conversation:error:not-found',
    detail: 'Conversation does not exist, or you do not have access.',
    instance: '00a5916655d650e920ccf0daf40ef4ee',
}

const internalError = {
    title: 'Internal Error.',
    type: 'https://developer.nexmo.com/api/conversation#system:error:internal-error',
    code: 'system:error:internal-error',
    detail: 'Something went wrong.',
    instance: '00a5916655d650e920ccf0daf40ef4ee',
}

const listResponse = {
    page_size: 10,
    _embedded: {
        conversations: [
            {
                id: 'CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a',
                name: 'customer_chat',
                display_name: 'Customer Chat',
                image_url: 'https://example.com/image.png',
                timestamp: {
                    created: '2019-09-03T18:40:24.324Z',
                },
                _links: {
                    self: {
                        href: 'https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a',
                    },
                },
            },
        ],
    },
    _links: {
        first: {
            href: 'https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10',
        },
        self: {
            href: 'https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D',
        },
        next: {
            href: 'https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D',
        },
        prev: {
            href: 'https://api.nexmo.com/v0.3/conversations?order=desc&page_size=10&cursor=7EjDNQrAcipmOnc0HCzpQRkhBULzY44ljGUX4lXKyUIVfiZay5pv9wg%3D',
        },
    },
}

const listOutput = ` Display Name ID                                       Name          
 ──────────── ──────────────────────────────────────── ───────────── 
              CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a customer_chat \n`

const conversationResponse = {
    id: 'CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a',
    name: 'customer_chat',
    display_name: 'Customer Chat',
    image_url: 'https://example.com/image.png',
    state: 'ACTIVE',
    sequence_number: 0,
    timestamp: {
        created: '2019-09-03T18:40:24.324Z',
    },
    properties: {
        ttl: 60,
    },
    numbers: {},
    _links: {
        self: {
            href: 'https://api.nexmo.com/v0.3/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a',
        },
    },
}

const conversationInput = {
    name: 'customer_chat',
    display_name: 'Customer Chat',
    image_url: 'https://example.com/image.png',
    properties: {
        ttl: 60,
    },
}

let showOutput = `Conversation Display Name: customer_chat (Customer Chat)

Conversation ID: CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a

Image Url: 'https://example.com/image.png'

State: ACTIVE

Sequence Number: 0

Created: 2019-09-03T18:40:24.324Z

Time to Live: 60
\n`

module.exports = {
    baseHost,
    genericAuthError,
    genericFailedError,
    notFoundError,
    internalError,
    conversationResponse,
    conversationInput,
    showOutput,
    listResponse,
    listOutput,
}
