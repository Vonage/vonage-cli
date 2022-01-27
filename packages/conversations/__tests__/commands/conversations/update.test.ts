import { expect, test } from '@oclif/test'
import { baseHost, conversationResponse, showOutput, genericFailedError, genericAuthError, internalError, notFoundError } from '../../fixtures/api-responses';

describe('apps:conversations:update', () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .put('/conversations/CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a', { name: 'my_conversation' })
            .reply(200, conversationResponse)
        )
        .command(['apps:conversations:update', 'CON-d66d47de-5bcb-4300-94f0-0c9d4b948e9a', '--name=my_conversation'])
        .it('Updates a conversation', ctx => {
            expect(ctx.stdout).to.equal(showOutput)
        })
    '--name=customer_chat'



    test
        .stdout()
        .nock(baseHost, api => api
            .put('/conversations/12345')
            .reply(400, genericFailedError)
        )
        .command(['apps:conversations:update', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Bad Request`)
        })
        .it('Handles a 400 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .put('/conversations/12345')
            .reply(401, genericAuthError)
        )
        .command(['apps:conversations:update', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`)
        })
        .it('Handles a 401 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .put('/conversations/12345')
            .reply(404, notFoundError)
        )
        .command(['apps:conversations:update', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Not Found`)
        })
        .it('Handles a 404 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .put('/conversations/12345')
            .reply(500, internalError)
        )
        .command(['apps:conversations:update', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Internal Server Error`)
        })
        .it('Handles a 500 error')

});