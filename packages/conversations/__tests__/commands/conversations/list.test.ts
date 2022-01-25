import { expect, test } from '@oclif/test'
import { baseHost, listResponse, listOutput, genericFailedError, genericAuthError, internalError } from '../../fixtures/api-responses';

describe('apps:conversations', () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations')
            .reply(200, listResponse)
        )
        .command(['apps:conversations'])
        .it('Lists all conversations', ctx => {
            expect(ctx.stdout).to.equal(listOutput);
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations')
            .reply(400, genericFailedError)
        )
        .command(['apps:conversations'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Bad Request`)
        })
        .it('Handles a 400 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations')
            .reply(401, genericAuthError)
        )
        .command(['apps:conversations'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`)
        })
        .it('Handles a 401 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations')
            .reply(500, internalError)
        )
        .command(['apps:conversations'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Internal Server Error`)
        })
        .it('Handles a 500 error')
});