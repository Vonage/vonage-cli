import { expect, test } from '@oclif/test'
import { baseHost, genericFailedError, genericAuthError, internalError, conversationResponse, showOutput } from '../../fixtures/api-responses';

describe('apps:conversations:create', () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .post('/conversations', { name: 'my_conversation' })
            .reply(200, conversationResponse)
        )
        .command(['apps:conversations:create', 'my_conversation'])
        .it('Creates a conversation', ctx => {
            expect(ctx.stdout).to.equal(showOutput)
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/conversations', { name: 'my_conversation' })
            .reply(400, genericFailedError)
        )
        .command(['apps:conversations:create', 'my_conversation'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Bad Request`)
        })
        .it('Handles a 400 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/conversations', { name: 'my_conversation' })
            .reply(401, genericAuthError)
        )
        .command(['apps:conversations:create', 'my_conversation'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`)
        })
        .it('Handles a 401 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .post('/conversations', { name: 'my_conversation' })
            .reply(500, internalError)
        )
        .command(['apps:conversations:create', 'my_conversation'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Internal Server Error`)
        })
        .it('Handles a 500 error')
});