const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/jwt/validate');
const { mockConsole } = require('../../helpers');
const { getTestMiddlewareArgs, testPrivateKey } = require('../../common');
const jwt = require('jsonwebtoken');

describe('Command: vonage jwt validate', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('should validate token', async () => {
    const args = getTestMiddlewareArgs();
    const token = jwt.sign(
      {
        application_id: args.appId,
        exp: parseInt(Date.now() / 1000) + 3600000,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );
    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.info.mock.calls[0]).toEqual(['Validating JWT token']);
    expect(consoleMock.log.mock.calls).toEqual([
      ['✅ Token was signed with the correct private key'],
      ['✅ Token has not expired'],
      [`✅ Application Id [${args.appId}] matches [${args.appId}]`],
      ['✅ All checks complete! Token is valid'],
    ]);
  });

  test('should validate token with sub and acl', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
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
    const token = jwt.sign(
      {
        application_id: args.appId,
        sub: sub,
        nbf: parseInt(Date.now() / 1000) - 3600,
        acl: acl,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    handler({
      ...args,
      sub: sub,
      token: token,
      privateKey: testPrivateKey,
      acl: acl,
    });

    expect(consoleMock.warn.mock.calls[0]).toEqual(['Token does not have an expiry date. It is good practice to include one.']);

    expect(consoleMock.log.mock.calls).toEqual([
      ['✅ Token was signed with the correct private key'],
      ['✅ Token not before time is valid'],
      [`✅ Application Id [${args.appId}] matches [${args.appId}]`],
      [`✅ Subject [${sub}] matches [${sub}]`],
      ['✅ ACL matches'],
      ['✅ All checks complete! Token is valid'],
    ]);
  });

  test('should validate token with claims but not arguments', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
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
    const token = jwt.sign(
      {
        application_id: args.appId,
        sub: sub,
        acl: acl,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.log.mock.calls[2]).toEqual(['✅ All checks complete! Token is valid']);
    expect(consoleMock.warn.mock.calls).toEqual([
      ['Token does not have an expiry date. It is good practice to include one.'],
      ['Subject is present in the token but not in the validation arguments'],
      ['ACL is present in the token but not in the validation arguments'],
    ]);
  });

  test('should fail to validate token when application id mismatches', async () => {
    const args = getTestMiddlewareArgs();
    const wrongAppId = faker.string.uuid();
    const token = jwt.sign(
      {
        application_id: wrongAppId,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    })).toThrow(
      `Application Id [${wrongAppId}] does not match [${args.appId}]`,
    );

    expect(consoleMock.log.mock.calls[1]).toEqual([`❌ Application Id [${wrongAppId}] does not match [${args.appId}]`]);
  });

  test('should fail to validate token when subject mismatches', async () => {
    const args = getTestMiddlewareArgs();
    const wrongSub = faker.string.alpha(10);
    const correctSub = faker.string.alpha(10);
    const token = jwt.sign(
      {
        application_id: args.appId,
        sub: wrongSub,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      token: token,
      privateKey: testPrivateKey,
      sub: correctSub,
    })).toThrow(
      `Subject [${wrongSub}] does not match [${correctSub}]`,
    );

    expect(consoleMock.info.mock.calls[0]).toEqual(['Validating JWT token']);
    expect(consoleMock.log.mock.calls[2]).toEqual(
      [`❌ Subject [${wrongSub}] does not match [${correctSub}]`],
    );
  });

  test('should fail to validate token when token is expired', async () => {
    const args = getTestMiddlewareArgs();
    const token = jwt.sign(
      {
        application_id: args.appId,
        exp: parseInt(Date.now() / 1000) - 3600000,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    })).toThrow('Token has expired');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token has expired'],
    );
  });

  test('should fail to validate token when token is nbf is before current date', async () => {
    const args = getTestMiddlewareArgs();
    const token = jwt.sign(
      {
        application_id: args.appId,
        nbf: parseInt(Date.now() / 1000) + 3600,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    })).toThrow('Token is not yet valid');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token is not yet valid'],
    );
  });

  test('should fail to validate token when acl mismatches', async () => {
    const args = getTestMiddlewareArgs();
    const wrongAcl = {
      'acl': {
        'paths': {
          '/calls/*': {
            'filters': {
              'to': '447977271009',
            },
          },
        },
      },
    };

    const correctAcl = {
      'acl': {
        'paths': {
          '/conferences/*': {},
        },
      },
    };

    const token = jwt.sign(
      {
        application_id: args.appId,
        acl: wrongAcl,
        exp: parseInt(Date.now() / 1000) + 3600000,
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      token: token,
      privateKey: testPrivateKey,
      acl: correctAcl,
    })).toThrow('ACL does not match');

    expect(consoleMock.log.mock.calls[3]).toEqual(['❌ ACL does not match']);
  });

  test('should fail to validate token when token is missing application id', async () => {
    const args = getTestMiddlewareArgs();
    const token = jwt.sign(
      {
      },
      testPrivateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    })).toThrow('Application Id is not present in the token');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Application Id is not present in the token'],
    );
  });
});
