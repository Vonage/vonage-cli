import { expect, test } from '@oclif/test';
import { baseHost, genericBody, genericSuccess, genericAuthError, genericFailedError } from '../fixtures/api-responses';


describe('numbers:update', async () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                ...genericBody
            })
            .reply(200, genericSuccess))
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com'])
        .it('adds moHttpUrl to the number', ctx => {
            expect(ctx.stdout).to.equal('"https://www.example.com" set for number 447700900000\n')
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                ...genericBody
            })
            .reply(401, genericAuthError)
        )
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com', '--apiKey=12345', '--apiSecret=ABCDE'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`);
        })
        .it('notifies on auth failure')

    //ideally - we would check and validate before this stage so we could provide better feedback
    test
        .stdout()
        .nock(baseHost, api => api
            .post('/update')
            .query({
                moHttpUrl: 'https://www.example.com',
                ...genericBody
            })
            .reply(420, genericFailedError)
        )
        .command(['numbers:update', '447700900000', 'GB', '--url=https://www.example.com', '--apiKey=12345', '--apiSecret=ABCDE'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Method Failed`)
        })
        .it('notifies on method failure')


});