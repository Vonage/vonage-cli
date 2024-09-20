const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/jwt/validate');
const { mockConsole } = require('../../helpers');
const { getTestMiddlewareArgs, testPrivateKey } = require('../../common');
const jwt = require('jsonwebtoken');
const yargs = require('yargs');

jest.mock('yargs');

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

    expect(yargs.exit).not.toHaveBeenCalled();
  });

  test('Should validate with sub and acl flags', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
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

    expect(consoleMock.log).toHaveBeenCalledTimes(7);

    const actualLog = consoleMock.log.mock.calls.map((call) => call[0]);

    expect(actualLog.join('\n')).toEqual([
      '✅ Token was signed with the correct private key',
      '✅ Token not before time is valid',
      `✅ Application Id [${args.appId}] matches [${args.appId}]`,
      `✅ Subject [${sub}] matches [${sub}]`,
      '✅ ACL matches',
      '  ✅ [ANY]  /messages/*',
      '  ✅ [ANY]  /calls/*',
      '  ✅ [ANY]  /conferences/*',
      '✅ All checks complete! Token is valid',
    ].join('\n'));
    expect(yargs.exit).not.toHaveBeenCalled();
  });

  test('Should validate token that has ACL and sub but command has no flags', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
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

    const actualLog = consoleMock.log.mock.calls.map((call) => call[0]);

    expect(actualLog.join('\n')).toEqual([
      '✅ Token was signed with the correct private key',
      `✅ Application Id [${args.appId}] matches [${args.appId}]`,
      `ℹ️ Subject [${sub}]`,
      'ℹ️ ACL present',
      '  ℹ️ [ANY]  /messages/*',
      '  ℹ️ [ANY]  /calls/*',
      '  ℹ️ [ANY]  /conferences/*',
      '✅ All checks complete! Token is valid',
    ].join('\n'));
    expect(yargs.exit).not.toHaveBeenCalled();
  });

  test('Should fail to validate token when application id mismatches', async () => {
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

    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.log.mock.calls[1]).toEqual([`❌ Application Id [${wrongAppId}] does not match [${args.appId}]`]);
    expect(yargs.exit).toHaveBeenCalledWith(22);
  });

  test('Should fail to validate token when subject mismatches', async () => {
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

    handler({
      ...args,
      token: token,
      privateKey: testPrivateKey,
      sub: correctSub,
    });

    expect(consoleMock.info.mock.calls[0]).toEqual(['Validating JWT token']);
    expect(consoleMock.log.mock.calls[2]).toEqual(
      [`❌ Subject [${wrongSub}] does not match [${correctSub}]`],
    );
    expect(yargs.exit).toHaveBeenCalledWith(22);
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

    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token has expired'],
    );
    expect(yargs.exit).toHaveBeenCalledWith(127);
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

    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Token is not yet valid'],
    );
    expect(yargs.exit).toHaveBeenCalledWith(127);
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

    handler({
      ...args,
      privateKey: testPrivateKey,
      token: token,
    });

    expect(consoleMock.log.mock.calls[1]).toEqual(
      ['❌ Application Id is not present in the token'],
    );
    expect(yargs.exit).toHaveBeenCalledWith(22);
  });
});
