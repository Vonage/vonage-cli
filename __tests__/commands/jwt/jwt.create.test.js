const { faker } = require('@faker-js/faker');
const { handler, jwtFlags } = require('../../../src/commands/jwt/create');
const { mockConsole } = require('../../helpers');
const { getTestMiddlewareArgs, testPrivateKey } = require('../../common');
const jwt = require('jsonwebtoken');

describe('Command: vonage jwt create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('should generate a JWT', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      privateKey: testPrivateKey,
    });
    expect(console.info).toHaveBeenCalledWith('Creating JWT token');
    expect(console.log).toHaveBeenCalled();
    const generatedToken = console.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('jti');
    expect(decoded).toHaveProperty('exp');
    expect(decoded).not.toHaveProperty('acl');
    expect(decoded).not.toHaveProperty('sub');
    expect(decoded.application_id).toBe(args.appId);
  });

  test('should generate a JWT with a subject', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
    handler({
      ...args,
      privateKey: testPrivateKey,
      sub: sub,
    });
    expect(console.info).toHaveBeenCalledWith('Creating JWT token');
    expect(console.log).toHaveBeenCalled();
    const generatedToken = console.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    expect(decoded.sub).toBe(sub);
  });

  test('should generate a JWT with an acl', async () => {
    const args = getTestMiddlewareArgs();
    const acl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
          },
        },
        '/calls/*': {
          'filters': {
            'to': '447977271009',
          },
        },
        '/conferences/*': {},
      },
    };

    handler({
      ...args,
      privateKey: testPrivateKey,
      acl: JSON.stringify(acl),
    });

    expect(jwtFlags.acl.coerce(JSON.stringify(acl)))
      .toEqual(acl);

    expect(console.info).toHaveBeenCalledWith('Creating JWT token');
    expect(console.log).toHaveBeenCalled();
    const generatedToken = console.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    expect(decoded.acl).toBe(JSON.stringify(acl));
  });

  test('should error when ACL is invalid', async () => {
    expect(jwtFlags.acl.coerce).toBeDefined();
    expect(() => jwtFlags.acl.coerce('invalid')).toThrow('Failed to parse JSON for ACL');
    expect(() => jwtFlags.acl.coerce('{"foo": "bar"}')).toThrow('ACL Failed to validate against schema');
  });
});
