import { expect, test } from '@oclif/test';
import { baseHost, genericBody, genericSuccess, genericAuthError, genericFailedError } from '../fixtures/api-responses';


describe('numbers:cancel', async () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .post('/cancel')
            .query(genericBody)
            .reply(200, genericSuccess))
        .command(['numbers:cancel', '447700900000', 'GB'])
        .it('numbers can be cancelled', ctx => {
            expect(ctx.stdout).to.equal(`Number 447700900000 has been cancelled.\n`)
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/cancel')
            .query(genericBody)
            .reply(401, genericAuthError)
        )
        .command(['numbers:cancel', '447700900000', 'GB'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`);
        })
        .it('notifies on auth failure')

    // //ideally - we would check and validate before this stage so we could provide better feedback
    test
        .stdout()
        .nock(baseHost, api => api
            .post('/cancel')
            .query(genericBody)
            .reply(420, genericFailedError)
        )
        .command(['numbers:cancel', '447700900000', 'GB'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Method Failed`)
        })
        .it('notifies on method failure')


});