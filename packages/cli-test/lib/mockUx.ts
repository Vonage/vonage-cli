import { jest } from '@jest/globals';
import { ux } from '@oclif/core';
import {
  UXFactory,
  ConfirmCurry,
  PromptCurry,
  TruncateStringCurry,
  dumpObject,
  dumpArray,
  dumpKey,
  dumpValue,
  dumpCommand,
} from '@vonage/cli-ux';

export type MockUX = {
  dumpObject: jest.MockedFunction<typeof dumpObject> & typeof dumpObject,
  dumpArray: jest.MockedFunction<typeof dumpArray> & typeof dumpArray,
  dumpKey: jest.MockedFunction<typeof dumpKey> & typeof dumpKey,
  dumpValue: jest.MockedFunction<typeof dumpValue> & typeof dumpValue,
  dumpCommand: jest.MockedFunction<typeof dumpCommand> & typeof dumpCommand,
  truncateString: jest.MockedFunction<TruncateStringCurry> & TruncateStringCurry,
  icon: string,
  brand: string,
  logo: string,
  developerLink: string,
  cliLink: string,
  log: jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  debug: jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  verbose: jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  confirm: jest.MockedFunction<ConfirmCurry> & ConfirmCurry,
  prompt: jest.MockedFunction<PromptCurry> & PromptCurry,
} & UXFactory;

export const getMockUX = (): MockUX => ({
  dumpObject: jest.fn() as jest.MockedFunction<typeof dumpObject> & typeof dumpObject,
  dumpArray: jest.fn() as jest.MockedFunction<typeof dumpArray> & typeof dumpArray,
  dumpKey: jest.fn() as jest.MockedFunction<typeof dumpKey> & typeof dumpKey,
  dumpValue: jest.fn() as jest.MockedFunction<typeof dumpValue> & typeof dumpValue,
  dumpCommand: jest.fn() as jest.MockedFunction<typeof dumpCommand> & typeof dumpCommand,
  truncateString: jest.fn() as jest.MockedFunction<TruncateStringCurry> & TruncateStringCurry,
  icon: 'icon',
  brand: 'brand',
  logo: 'logo',
  developerLink: 'developerLink',
  cliLink: 'cliLink',
  log: jest.fn() as jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  debug: jest.fn() as jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  verbose: jest.fn() as jest.MockedFunction<typeof ux.stderr> & typeof ux.stderr,
  confirm: jest.fn() as jest.MockedFunction<ConfirmCurry> & ConfirmCurry,
  prompt: jest.fn() as jest.MockedFunction<PromptCurry> & PromptCurry,
});
