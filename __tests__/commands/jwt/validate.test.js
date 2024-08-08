const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/jwt/validate');
const { mockConsole } = require('../../helpers');
const { getTestData } = require('../../common');
const jwt = require('jsonwebtoken');

describe('Command: vonage jwt validate', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('should validate token', async () => {
    const {globalArgs, privateKey} = getTestData();
    const token = jwt.sign(
      {
        application_id: globalArgs.appId,
        exp: parseInt(Date.now() / 1000) + 3600000,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );
    handler({
      ...globalArgs,
      token: token,
    });

    expect(consoleMock.info.mock.calls[0]).toEqual(['Validating JWT token']);
    expect(consoleMock.log.mock.calls).toEqual([
      ['✅ Token was signed with the correct private key'],
      ['✅ Token has not expired'],
      [`✅ Application Id [${globalArgs.appId}] matches [${globalArgs.appId}]`],
      ['✅ All checks complete! Token is valid'],
    ]);
  });

  test('should validate token with sub and acl', async () => {
    const {globalArgs, privateKey} = getTestData();
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
        application_id: globalArgs.appId,
        sub: sub,
        nbf: parseInt(Date.now() / 1000) - 3600,
        acl: acl,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    handler({
      ...globalArgs,
      sub: sub,
      token: token,
      acl: acl,
    });

    expect(consoleMock.warn.mock.calls[0]).toEqual(['Token does not have an expiry date. It is good practice to include one.']);

    expect(consoleMock.log.mock.calls).toEqual([
      ['✅ Token was signed with the correct private key'],
      ['✅ Token not before time is valid'],
      [`✅ Application Id [${globalArgs.appId}] matches [${globalArgs.appId}]`],
      [`✅ Subject [${sub}] matches [${sub}]`],
      ['✅ ACL matches'],
      ['✅ All checks complete! Token is valid'],
    ]);
  });

  test('should validate token with claims but not arguments', async () => {
    const {globalArgs, privateKey} = getTestData();
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
        application_id: globalArgs.appId,
        sub: sub,
        acl: acl,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    handler({
      ...globalArgs,
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
    const {globalArgs, privateKey} = getTestData();
    const wrongAppId = faker.string.uuid();
    const token = jwt.sign(
      {
        application_id: wrongAppId,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
    })).toThrow(
      `Application Id [${wrongAppId}] does not match [${globalArgs.appId}]`,
    );

    expect(consoleMock.log.mock.calls[1]).toEqual([`❌ Application Id [${wrongAppId}] does not match [${globalArgs.appId}]`]);
  });

  test('should fail to validate token when subject mismatches', async () => {
    const {globalArgs, privateKey} = getTestData();
    const wrongSub = faker.string.alpha(10);
    const correctSub = faker.string.alpha(10);
    const token = jwt.sign(
      {
        application_id: globalArgs.appId,
        sub: wrongSub,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
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
    const {globalArgs, privateKey} = getTestData();
    const token = jwt.sign(
      {
        application_id: globalArgs.appId,
        exp: parseInt(Date.now() / 1000) - 3600000,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
    })).toThrow('Token has expired');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token has expired'],
    );
  });

  test('should fail to validate token when token is nbf is before current date', async () => {
    const {globalArgs, privateKey} = getTestData();
    const token = jwt.sign(
      {
        application_id: globalArgs.appId,
        nbf: parseInt(Date.now() / 1000) + 3600,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
    })).toThrow('Token is not yet valid');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token is not yet valid'],
    );
  });

  test('should fail to validate token when acl mismatches', async () => {
    const {globalArgs, privateKey} = getTestData();
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
        application_id: globalArgs.appId,
        acl: wrongAcl,
        exp: parseInt(Date.now() / 1000) + 3600000,
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
      acl: correctAcl,
    })).toThrow('ACL does not match');

    expect(consoleMock.log.mock.calls[3]).toEqual(['❌ ACL does not match']);
  });

  test('should fail to validate token when token is missing application id', async () => {
    const {globalArgs, privateKey} = getTestData();
    const token = jwt.sign(
      {
      },
      privateKey,
      {
        algorithm: 'RS256',
        header: { typ: 'JWT', alg: 'RS256' },
      },
    );

    expect(() => handler({
      ...globalArgs,
      token: token,
    })).toThrow('Application Id is not present in the token');

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Application Id is not present in the token'],
    );
  });
});
