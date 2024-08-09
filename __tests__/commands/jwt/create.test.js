const { faker } = require('@faker-js/faker');
const { handler, jwtFlags } = require('../../../src/commands/jwt/create');
const { mockConsole } = require('../../helpers');
const { getTestData } = require('../../common');
const jwt = require('jsonwebtoken');

describe('Command: vonage jwt create', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('should generate a JWT', async () => {
    const {globalArgs, privateKey} = getTestData();
    handler({
      ...globalArgs,
    });
    expect(consoleMock.info).toHaveBeenCalledWith('Creating JWT token');
    expect(consoleMock.log).toHaveBeenCalled();
    const generatedToken = consoleMock.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, privateKey, { algorithms: ['RS256'] });
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('jti');
    expect(decoded).toHaveProperty('exp');
    expect(decoded).not.toHaveProperty('acl');
    expect(decoded).not.toHaveProperty('sub');
    expect(decoded.application_id).toBe(globalArgs.appId);
  });

  test('should generate a JWT with a subject', async () => {
    const {globalArgs, privateKey} = getTestData();
    const sub = faker.string.alpha(10);
    handler({
      ...globalArgs,
      sub: sub,
    });
    expect(consoleMock.info).toHaveBeenCalledWith('Creating JWT token');
    expect(consoleMock.log).toHaveBeenCalled();
    const generatedToken = consoleMock.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, privateKey, { algorithms: ['RS256'] });
    expect(decoded.sub).toBe(sub);
  });

  test('should generate a JWT with an acl', async () => {
    const {globalArgs, privateKey} = getTestData();
    const acl = {
      'acl': {
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
      },
    };

    handler({
      ...globalArgs,
      acl: JSON.stringify(acl),
    });

    expect(jwtFlags.acl.coerce(JSON.stringify(acl)))
      .toEqual(acl);

    expect(consoleMock.info).toHaveBeenCalledWith('Creating JWT token');
    expect(consoleMock.log).toHaveBeenCalled();
    const generatedToken = consoleMock.log.mock.calls[0][0];

    const decoded = jwt.verify(generatedToken, privateKey, { algorithms: ['RS256'] });
    expect(decoded.acl).toBe(JSON.stringify(acl));
  });

  test('should error when ACL is invalid', async () => {
    expect(jwtFlags.acl.coerce).toBeDefined();
    expect(() => jwtFlags.acl.coerce('invalid')).toThrow('Failed to parse JSON for ACL');
    expect(() => jwtFlags.acl.coerce('{"foo": "bar"}')).toThrow('ACL Failed to validate against schema');
  });
});
