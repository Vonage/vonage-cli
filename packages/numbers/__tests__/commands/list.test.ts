import { expect, test } from '@oclif/test';
import { numbersOutput, keysOnlyBody, numbersResponse, genericAuthError, genericFailedError } from '../fixtures/api-responses';

describe('numbers:list', async () => {
    let baseHost = 'https://rest.nexmo.com/account/numbers';

    test
        .nock(baseHost, api => api
            .get('')
            .query(keysOnlyBody)
            .reply(200, numbersResponse))
        .stdout()
        .command(['numbers'])
        .it('displays phone numbers', ctx => {
            expect(ctx.stdout).to.equal(numbersOutput)
        });

    test
        .nock(baseHost, api => api
            .get('')
            .query(keysOnlyBody)
            .reply(420, genericFailedError)
        )
        .command(['numbers'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Method Failed`)
        })
        .it('notifies on method failure')

    test
        .nock(baseHost, api => api
            .get('')
            .query(keysOnlyBody)
            .reply(401, genericAuthError)
        )
        .command(['numbers'])
        .catch(ctx => {
            expect(ctx.message).to.equal(`Authentication Failure`);
        })
        .it('notifies on auth failure')

});