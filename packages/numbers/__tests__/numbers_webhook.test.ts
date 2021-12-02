import { expect, test } from '@oclif/test'

describe('numbers:webhook', () => {

    const genericSuccess = {
        "error-code": "200",
        "error-code-label": "success"
    }

    test
        .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
        .nock('https://rest.nexmo.com/number', api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                msisdn: 447700900000,
                country: 'GB',
                api_key: '12345',
                api_secret: 'ABCDE'
            })
            .reply(200, genericSuccess)
        )
        .stdout()
        .command(['numbers:webhook', '447700900000', 'GB', '--url=https://www.example.com', '--apiKey=12345', '--apiSecret=ABCDE'])
        .it('adds a moHttpUrl to the number', ctx => {
            expect(ctx.stdout).to.equal(`"https://www.example.com" set for number 447700900000\n`)
        })

    // it('removes a moHttpUrl from the number', ctx => { })
    // it('has sensible', ctx => { })
    // it('notifies on auth failure', ctx => { })
    // it('notifies when webhook is not live', ctx => { })
    // it('has helpful documentation', ctx => { })
});