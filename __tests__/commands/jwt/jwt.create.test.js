import { faker } from '@faker-js/faker';
import { handler, jwtFlags } from '../../../src/commands/jwt/create.js';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey } from '../../common.js';
import jwt from 'jsonwebtoken';

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
    assertCalledWith(console.info, 'Creating JWT token');
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

  test('should generate a JWT with a subject', async () => {
    const args = getTestMiddlewareArgs();
    const sub = faker.string.alpha(10);
    handler({
      ...args,
      privateKey: testPrivateKey,
      sub: sub,
    });
    assertCalledWith(console.info, 'Creating JWT token');
    assert.ok(console.log.mock.callCount() > 0);
    const generatedToken = console.log.mock.calls[0].arguments[0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    assert.strictEqual(decoded.sub, sub);
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

    assert.deepStrictEqual(jwtFlags.acl.coerce(JSON.stringify(acl)), acl);

    assertCalledWith(console.info, 'Creating JWT token');
    assert.ok(console.log.mock.callCount() > 0);
    const generatedToken = console.log.mock.calls[0].arguments[0];

    const decoded = jwt.verify(generatedToken, testPrivateKey, { algorithms: ['RS256'] });
    assert.strictEqual(decoded.acl, JSON.stringify(acl));
  });

  test('should error when ACL is invalid', async () => {
    assert.notStrictEqual(jwtFlags.acl.coerce, undefined);
    assert.throws(() => jwtFlags.acl.coerce('invalid'), /Failed to parse JSON for ACL/);
    assert.throws(() => jwtFlags.acl.coerce('{"foo": "bar"}'), /ACL Failed to validate against schema/);
  });
});
