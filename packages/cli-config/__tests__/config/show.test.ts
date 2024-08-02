import { jest, expect } from '@jest/globals';
import { Config, Plugin } from '@oclif/core';
//import testCases from '../../__dataSets__/showCommand';
import ShowConfig from'../../../lib/commands/config/show';

describe('Config Command', () => {
  test.each(testCases)(
    'Will $label',
    async ({ commandArgs, expected, clearEnv, config }) => {
      const {result, stdout} = await runCommand(['foo:bar']);
      expect(stdout).toBe('hello world!\n');
      await ShowConfig.run(commandArgs);
      expect(true).toBe(true);
    },
  );
});
