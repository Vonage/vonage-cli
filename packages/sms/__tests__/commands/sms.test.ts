import { expect, test } from '@oclif/test';

let successResponse = {
    "message-count": "1",
    "messages": [
        {
            "to": "123456",
            "message-id": "0A0000000123ABCD1",
            "status": "0",
            "remaining-balance": "3.14159265",
            "message-price": "0.03330000",
            "network": "12345",
            "client-ref": "my-personal-reference",
            "account-ref": "customer1234"
        }
    ]
}

let failedResponse = {
    "message-count": "1",
    "messages": [
        {
            "status": "2",
            "error-text": "Missing to param"
        }
    ]
}

describe('sms', async () => {
    test
        .stdout({ print: true })
        .nock('https://rest.nexmo.com/sms', api => api
            .post('/json', {
                "api_key": process.env.VONAGE_API_KEY,
                "api_secret": process.env.VONAGE_API_SECRET,
                "text": "Hello from the Vonage CLI!",
                "to": "123456",
                "from": "567890"
            })
            .reply(200, successResponse))
        .command(['sms', '--to=123456', '--from=567890', '--message=Hello from the Vonage CLI!'])
        .it('messsages send successfully', ctx => {
            expect(ctx.stdout).to.equal(`Message sent successfully.\n`)
        })

    test
        .stdout({ print: true })
        .nock('https://rest.nexmo.com/sms', api => api
            .post('/json', {
                "api_key": process.env.VONAGE_API_KEY,
                "api_secret": process.env.VONAGE_API_SECRET,
                "text": "Hello from the Vonage CLI!",
                "to": "123456",
                "from": "567890"
            })
            .reply(200, failedResponse)
        )
        .command(['sms', '--to=123456', '--from=567890', '--message=Hello from the Vonage CLI!'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Message failed with error: Missing to param`);
        })
        .it('notifies on errors')



});