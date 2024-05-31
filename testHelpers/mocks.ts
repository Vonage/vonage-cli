import { jest } from '@jest/globals';
import readline from 'node:readline';
import {
  normalize,
  parse,
} from 'node:path';
import {
  existsSync,
  readFileSync,
  mkdirSync,
  writeFileSync
} from 'node:fs';

export const existsMock = jest.fn(existsSync);
export const normalizeMock = jest.fn(normalize);
export const readFileMock = jest.fn(readFileSync);
export const parseMock = jest.fn(parse);
export const makeDirMock = jest.fn(mkdirSync);
export const writeFileMock = jest.fn(writeFileSync);

export const buildReadlineQuestionMock = (
  respond: string,
) => (
  _: unknown,
  callback
) => callback(respond);

export const affirmativeConfirm = buildReadlineQuestionMock('y');
export const negativeConfirm = buildReadlineQuestionMock('n');

export const getMockReadline = (): readline.Interface => ({
  close: jest.fn(),
  question: jest.fn(),
  prompt: jest.fn(),
  write: jest.fn(),
  // Cast to unknown to since we are not implementing all methods
}) as unknown as readline.Interface;

afterEach(() => {
  existsMock.mockClear();
  normalizeMock.mockClear();
  readFileMock.mockClear();
  parseMock.mockClear();
  makeDirMock.mockClear();
  writeFileMock.mockClear();
});
