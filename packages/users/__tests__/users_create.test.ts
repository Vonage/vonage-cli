import { expect, test } from '@oclif/test'

function createSuccessResponse(data) {
  return (
    {
      "id": "USR-11111111-1111-1111-1111-111111111111",
      "name": `${data.name}`,
      "display_name": `${data.display_name || ''}`,
      "image_url": `${data.image_url || ''}`,
      "properties": {
        "custom_data": {}
      },
      "channels": {},
      "_links": {
        "self": {
          "href": "https://api.nexmo.com/v0.3/users/USR-11111111-1111-1111-1111-111111111111"
        }
      }
    }
  )
}

function successOutput(data) {
  return (`Creating User... InitializingCreating User... done
User ID: USR-11111111-1111-1111-1111-111111111111

Name: ${data.name} (${data.display_name || ''})

Image Url: ${data.image_url || 'None'}

`);
}

describe('users:create', () => {
  let request;

  test
    .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
    .nock(`https://api.nexmo.com/v0.3/users`, api => api
      .post('')
      .reply(200, (uri, requestBody) => {
        request = requestBody;
        return createSuccessResponse(requestBody);
      })
    )
    .stdout()
    .command(['apps:users:create', '"Alice"'])
    .it('should create a user with only the name', ctx => {
      expect(ctx.stdout).to.equal(successOutput(request))
    })

  test
    .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
    .nock(`https://api.nexmo.com/v0.3/users`, api => api
      .post('')
      .reply(200, (uri, requestBody) => {
        request = requestBody;
        return createSuccessResponse(requestBody);
      })
    )
    .stdout()
    .command(['apps:users:create', '"Alice"', '--display_name="Alice'])
    .it('should create a user with name and display_name', ctx => {
      expect(ctx.stdout).to.equal(successOutput(request))
    })

  test
    .env({ VONAGE_API_KEY: '12345', VONAGE_API_SECRET: 'ABCDE' })
    .nock(`https://api.nexmo.com/v0.3/users`, api => api
      .post('')
      .reply(200, (uri, requestBody) => {
        request = requestBody;
        return createSuccessResponse(requestBody);
      })
    )
    .stdout()
    .command(['apps:users:create', '"Alice"', '--image_url="http://www.example.com/image.png'])
    .it('should create a user with name and image_url', ctx => {
      expect(ctx.stdout).to.equal(successOutput(request))
    })

});
