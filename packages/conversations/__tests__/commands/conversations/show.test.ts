import { expect, test } from '@oclif/test'
import { baseHost, genericFailedError, conversationResponse, genericAuthError, internalError, notFoundError, showOutput } from '../../fixtures/api-responses';

describe('apps:conversations:show', () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations/12345')
            .reply(200, conversationResponse)
        )
        .command(['apps:conversations:show', '12345'])
        .it('Shows a conversation', ctx => {
            expect(ctx.stdout).to.equal(showOutput)
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations/12345')
            .reply(400, genericFailedError)
        )
        .command(['apps:conversations:show', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Bad Request`)
        })
        .it('Handles a 400 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations/12345')
            .reply(401, genericAuthError)
        )
        .command(['apps:conversations:show', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`)
        })
        .it('Handles a 401 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations/12345')
            .reply(404, notFoundError)
        )
        .command(['apps:conversations:show', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Not Found`)
        })
        .it('Handles a 404 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .get('/conversations/12345')
            .reply(500, internalError)
        )
        .command(['apps:conversations:show', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Internal Server Error`)
        })
        .it('Handles a 500 error')
});