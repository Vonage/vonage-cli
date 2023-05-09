import { expect } from '@jest/globals';
// Include this in every test file to ensure TS compiles
// eslint-disable-next-line
import * as custom from '../../../../testHelpers/stdoutAssertions'
import JWTCommand from '../../lib/commands/jwt';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import jwtTests from '../__dataSets__/jwt';

describe('JWT Commands', () => {
  beforeEach(() => {
    process.env.VONAGE_PRIVATE_KEY = custom.keyFile;
  });

  test.each(jwtTests)(
    'Will $label',
    async ({ commandArgs, expectedClaims, includeExpire }) => {
      await JWTCommand.run(commandArgs);
      const token = custom.getStdOutLine(1);
      const claims = verify(token, readFileSync(custom.keyFile), {
        ignoreExpiration: true,
      });

      delete claims.iat;
      delete claims.jti;
      if (!includeExpire) {
        delete claims.exp;
      }

      expect(claims).toEqual(expectedClaims);
    },
  );
});
