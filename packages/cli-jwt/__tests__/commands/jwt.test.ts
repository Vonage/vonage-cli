import { expect, jest } from '@jest/globals';
import { keyFile } from '../../../../testHelpers/helpers';
import JWTCommand from '../../lib/commands/jwt';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import jwtTests from '../__dataSets__/jwt';
import { Command } from '@oclif/core';

const logMock = jest.fn();
Command.prototype.log = logMock;

describe('JWT Commands', () => {
  beforeEach(() => {
    process.env.VONAGE_PRIVATE_KEY = keyFile;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test.each(jwtTests)(
    'Will $label',
    async ({ commandArgs, expectedClaims, includeExpire }) => {
      await JWTCommand.run(commandArgs);
      const token = logMock.mock.calls[0][0];
      const claims = verify(token, readFileSync(keyFile), {
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
