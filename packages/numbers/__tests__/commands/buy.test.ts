import { expect, test } from '@oclif/test'
import { baseHost, countryErrorResponse, genericBody, genericFailedError, genericAuthError } from '../fixtures/api-responses';

describe('numbers:buy', () => {
  test
    .stdout()
    .nock(baseHost, api => api
      .post('/buy')
      .query(genericBody)
      .reply(420, countryErrorResponse)
    )
    .command(['numbers:buy', '447700900000', 'GB'])
    .catch(ctx => {
      expect(ctx.message).to.equal(`Address Validation Required`)
      // figure how to add custom types to error or get 
      // expect(ctx.suggestions).to.equal(`Address Validation Required`)
    })
    .it('Number requires address validation error is handled properly')

  test
    .stdout()
    .nock('https://rest.nexmo.com/number', api => api
      .post('/buy')
      .query(genericBody)
      .reply(420, genericFailedError)
    )
    .command(['numbers:buy', '447700900000', 'GB'])
    .catch(ctx => {
      expect(ctx.message).to.equal(`Method Failed`)
    }).it('notifies on method failure')

  test
    .stdout()
    .nock('https://rest.nexmo.com/number', api => api
      .post('/buy')
      .query(genericBody)
      .reply(401, genericAuthError)
    )
    .command(['numbers:buy', '447700900000', 'GB'])
    .catch(ctx => {
      expect(ctx.message).to.equal(`Authentication Failure`);
    })
    .it('notifies on auth failure')

});