import { expect, test } from '@oclif/test'
import { baseHost, genericFailedError, genericAuthError, internalError, notFoundError } from '../../fixtures/api-responses';

describe('apps:conversations:delete', () => {
    test
        .stdout()
        .nock(baseHost, api => api
            .delete('/conversations/12345')
            .reply(204)
        )
        .command(['apps:conversations:delete', '12345'])
        .it('Deletes a conversation', ctx => {
            expect(ctx.stdout).to.equal(`Conversation 12345 successfully deleted.\n`)
        })

    test
        .stdout()
        .nock(baseHost, api => api
            .delete('/conversations/12345')
            .reply(400, genericFailedError)
        )
        .command(['apps:conversations:delete', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Bad Request`)
        })
        .it('Handles a 400 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .delete('/conversations/12345')
            .reply(401, genericAuthError)
        )
        .command(['apps:conversations:delete', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`)
        })
        .it('Handles a 401 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .delete('/conversations/12345')
            .reply(404, notFoundError)
        )
        .command(['apps:conversations:delete', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Not Found`)
        })
        .it('Handles a 404 error')

    test
        .stdout()
        .nock(baseHost, api => api
            .delete('/conversations/12345')
            .reply(500, internalError)
        )
        .command(['apps:conversations:delete', '12345'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Internal Server Error`)
        })
        .it('Handles a 500 error')
});