import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey } from '../../common.js';
import jwt from 'jsonwebtoken';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/jwt/validate.js', __moduleMocks);

describe('Command: vonage jwt validate', () => {
  beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
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

    assert.deepStrictEqual(console.info.mock.calls[0].arguments, ['Validating JWT token']);
    assert.deepStrictEqual(console.log.mock.calls.map(c => c.arguments), [
      ['✅ Token was signed with the correct private key'],
      ['✅ Token has not expired'],
      [`✅ Application Id [${args.appId}] matches [${args.appId}]`],
      ['✅ All checks complete! Token is valid'],
    ]);

    assert.strictEqual(exitMock.mock.callCount(), 0);
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

    assert.strictEqual(console.log.mock.callCount(), 7);

    const actualLog = console.log.mock.calls.map((call) => call.arguments[0]);

    assert.strictEqual(actualLog.join('\n'), [
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
    assert.strictEqual(exitMock.mock.callCount(), 0);
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

    const actualLog = console.log.mock.calls.map((call) => call.arguments[0]);

    assert.strictEqual(actualLog.join('\n'), [
      '✅ Token was signed with the correct private key',
      `✅ Application Id [${args.appId}] matches [${args.appId}]`,
      `ℹ️ Subject [${sub}]`,
      'ℹ️ ACL present',
      '  ℹ️ [ANY]  /messages/*',
      '  ℹ️ [ANY]  /calls/*',
      '  ℹ️ [ANY]  /conferences/*',
      '✅ All checks complete! Token is valid',
    ].join('\n'));
    assert.strictEqual(exitMock.mock.callCount(), 0);
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

    assert.deepStrictEqual(console.log.mock.calls[1].arguments, [`❌ Application Id [${wrongAppId}] does not match [${args.appId}]`]);
    assertCalledWith(exitMock, 22);
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

    assertNthCalledWith(
      console.log,
      3,
      `❌ Subject [${wrongSub}] does not match [${correctSub}]`,
    );

    assertCalledWith(exitMock, 22);
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

    assertNthCalledWith(
      console.log,
      2,
      '❌ Token has expired',
    );
    assertCalledWith(exitMock, 127);
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
    assertNthCalledWith(
      console.log,
      2,
      '❌ Token is not yet valid',
    );
    assertCalledWith(exitMock, 127);
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

    assertNthCalledWith(
      console.log,
      2,
      '❌ Application Id is not present in the token',
    );

    assertCalledWith(exitMock, 22);
  });
});
