import { expect, test } from '@oclif/test';
import { genericSuccess, genericAuthError, genericFailedError } from '../fixtures/api-responses';


describe('numbers:update', async () => {
    let baseHost = 'https://rest.nexmo.com/number';

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                msisdn: '447700900000',
                country: 'GB',
                api_key: '12345',
                api_secret: 'ABCDE'
            })
            .reply(200, genericSuccess))
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com'])
        .it('adds moHttpUrl to the number', ctx => {
            expect(ctx.stdout).to.equal('"https://www.example.com" set for number 447700900000\n')
        })

    test
        .stdout()
        .nock('https://rest.nexmo.com/number', api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                msisdn: '447700900000',
                country: 'GB',
                api_key: '12345',
                api_secret: 'ABCDE'
            })
            .reply(401, genericAuthError)
        )
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com', '--apiKey=12345', '--apiSecret=ABCDE'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication failure`)
        })
        .it('notifies on auth failure')

    // //ideally - we would check and validate before this stage so we could provide better feedback
    test
        .stderr()
        .nock('https://rest.nexmo.com/number', api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                msisdn: '447700900000',
                country: 'GB',
                api_key: '12345',
                api_secret: 'ABCDE'
            })
            .reply(420, genericFailedError)
        )
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com', '--apiKey=12345', '--apiSecret=ABCDE'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Method failed`)
        })



});