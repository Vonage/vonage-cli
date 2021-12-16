import { expect, test } from '@oclif/test'
import { countryErrorResponse } from '../fixtures/api-responses';

describe('numbers:buy', () => {
  let baseHost = 'https://rest.nexmo.com/number';

  test
    .stdout()
    .nock(baseHost, api => api
      .post('/buy')
      .query({
        country: "GB",
        msisdn: 447700900000,
        api_key: process.env.VONAGE_API_KEY,
        api_secret: process.env.VONAGE_API_SECRET
      })
      .reply(420, countryErrorResponse)
    )
    .command(['numbers:buy', '447700900000', 'GB'])
    .catch(ctx => {
      expect(ctx.message).to.equal(`Address Validation Required`)
      // figure how to add custom types to error or get 
      // expect(ctx.suggestions).to.equal(`Address Validation Required`)
    })
    .it('Number requires address validation error is handled properly')
});

// Error: Address Validation Required
//     at Object.error (/home/kellyjandrews/Insync/kelly@kellyjandrews.com/Google Drive/Apps/vonage-cli/packages/utils/node_modules/@oclif/errors/lib/index.js:26:15)
//     at NumberBuy.error (/home/kellyjandrews/Insync/kelly@kellyjandrews.com/Google Drive/Apps/vonage-cli/packages/utils/node_modules/@oclif/command/lib/command.js:60:23)
//     at NumberBuy.<anonymous> (/home/kellyjandrews/Insync/kelly@kellyjandrews.com/Google Drive/Apps/vonage-cli/packages/numbers/src/commands/numbers/buy.ts:15:26)
//     at Generator.throw (<anonymous>)
//     at rejected (/home/kellyjandrews/Insync/kelly@kellyjandrews.com/Google Drive/Apps/vonage-cli/packages/numbers/node_modules/tslib/tslib.js:115:69)
//     at processTicksAndRejections (internal/process/task_queues.js:97:5) {
//   oclif: { exit: 2 },
//   code: 'ADDR_VALID',
//   suggestions: [
//     'Numbers from this country can be requested from the Dashboard (https://dashboard.nexmo.com/buy-numbers) as they require a valid local address to be provided before being purchased.'
//   ]
// }