import { expect, test } from '@oclif/test'

describe('numbers:buy', () => {

  const countryErrorResponse = {
    'error-code': '420',
    'error-code-label': 'Numbers from this country can be requested from the Dashboard (https://dashboard.nexmo.com/buy-numbers) as they require a valid local address to be provided before being purchased.'
  };


  // const updateResponse = {
  //   "error-code": "200",
  //   "error-code-label": "success"
  // };

  test
    .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
    .nock('https://rest.nexmo.com/number', api => api
      .post('/buy')
      .query({
        country: "GB",
        msisdn: 447700900000,
        api_key: '12345',
        api_secret: 'ABCDE'
      })
      .reply(420, countryErrorResponse)
    )
    .stdout()
    .command(['numbers:buy', '447700900000', 'GB', '--apiKey=12345', '--apiSecret=ABCDE'])
    .it('Purchase a GB Number provides proper feedback', ctx => {
      expect(ctx.stdout).to.equal(`Numbers from this country can be requested from the Dashboard (https://dashboard.nexmo.com/buy-numbers) as they require a valid local address to be provided before being purchased.\n`)
    })
});
