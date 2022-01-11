import { expect, test } from '@oclif/test'

describe('Apps:Link', () => {
  const allNumbersResponse = {
    "numbers": [
      { country: "US" }
    ],
  };

  const updateResponse = {
    "error-code": "200",
    "error-code-label": "success"
  };

  test
    .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
    .nock('https://rest.nexmo.com/account', api => api
      .get('/numbers')
      .query({ pattern: '15555555555', search_pattern: 1, api_key: '12345', api_secret: 'ABCDE' })
      .reply(200, allNumbersResponse)
    )
    .nock('https://rest.nexmo.com/number', api => api
      .post('/update')
      .query({ app_id: '1234-5678-abcd-efgh', country: 'US', msisdn: '15555555555', api_key: '12345', api_secret: 'ABCDE' })
      .reply(200, updateResponse)
    )
    .stdout()
    .command(['apps:link', '1234-5678-abcd-efgh', '--number=15555555555'])
    .it('Links phone number', ctx => {
      expect(ctx.stdout).to.equal(`Number '15555555555' is assigned to application '1234-5678-abcd-efgh'.\n`)
    })
});