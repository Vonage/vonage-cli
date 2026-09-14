import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import { handler, jwtFlags } from '../../../src/commands/jwt/create.js';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey } from '../../common.js';
import jwt from 'jsonwebtoken';

test('Command: vonage jwt create', { concurrency: 1 }, async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('should generate a JWT', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      privateKey: testPrivateKey,
    });
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Creating JWT token'])));;
    assert.ok(console.log.mock.callCount() > 0);
    const generatedToken = console.log.mock.calls[0].arguments[0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    assert.notStrictEqual(decoded['iat'], undefined);
    assert.notStrictEqual(decoded['jti'], undefined);
    assert.notStrictEqual(decoded['exp'], undefined);
    assert.strictEqual(decoded['acl'], undefined);
    assert.strictEqual(decoded['sub'], undefined);
    assert.strictEqual(decoded.application_id, args.appId);
  });

  await ctx.test('should generate a JWT with a subject', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
    handler({
      ...args,
      privateKey: testPrivateKey,
      sub: sub,
    });
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Creating JWT token'])));;
    assert.ok(console.log.mock.callCount() > 0);
    const generatedToken = console.log.mock.calls[0].arguments[0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    assert.strictEqual(decoded.sub, sub);
  });

  await ctx.test('should generate a JWT with an acl', async () => {
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

    assert.deepStrictEqual(jwtFlags.acl.coerce(JSON.stringify(acl)), acl);

    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Creating JWT token'])));;
    assert.ok(console.log.mock.callCount() > 0);
    const generatedToken = console.log.mock.calls[0].arguments[0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    assert.strictEqual(decoded.acl, JSON.stringify(acl));
  });

  await ctx.test('should error when ACL is invalid', async () => {
    assert.notStrictEqual(jwtFlags.acl.coerce, undefined);
    assert.throws(() => jwtFlags.acl.coerce('invalid'), /Failed to parse JSON for ACL/);
    assert.throws(() => jwtFlags.acl.coerce('{"foo": "bar"}'), /ACL Failed to validate against schema/);
  });
});
