import { jest, expect } from '@jest/globals';
import { dumpValue } from '../lib/ux';
import chalk from 'chalk';
import { asMock } from '../../../testHelpers/helpers';
import { normalize } from 'path';

jest.unstable_mockModule('@oclif/core', () => ({
  __esModule: true,
  ...(jest.requireActual('@oclif/core') as Record<string, unknown>),
  ux: {
    log: jest.fn(),
    confirm: jest.fn(),
  },
}));

jest.unstable_mockModule('node:fs', () => ({
  __esModule: true,
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

const { readFileSync, mkdirSync, writeFileSync, existsSync } = await import(
  'node:fs'
);

const { ux } = await import('@oclif/core');

const { loadFile, loadJSON, saveFile } = await import('../lib/fs');
const mockReadFile = asMock(readFileSync);
const mockDirExists = asMock(existsSync);
const mockWriteFile = asMock(writeFileSync);
const mockCreateDir = asMock(mkdirSync);
const mockConfirm = asMock(ux.confirm);
const mockLog = asMock(ux.log);

describe('File System tests', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('Can load JSON file', () => {
    mockReadFile.mockReturnValue(JSON.stringify({ foo: 'bar' }));
    mockDirExists.mockReturnValue(true);

    expect(loadJSON('test.json')).toEqual({ foo: 'bar' });
    expect(mockDirExists.mock.calls).toEqual([['test.json']]);
    expect(mockReadFile.mock.calls).toEqual([['test.json']]);
  });

  test('Can return empty object when file does not exist', () => {
    expect(loadJSON('test.json')).toEqual({});
    expect(mockReadFile).not.toHaveBeenCalled();
    expect(mockDirExists.mock.calls).toEqual([['test.json']]);
  });

  test('Can load file', () => {
    mockReadFile.mockReturnValue("Ford I think I'm a couch");
    mockDirExists.mockReturnValue(true);

    expect(loadFile('test.txt')).toEqual("Ford I think I'm a couch");
    expect(mockDirExists.mock.calls).toEqual([['test.txt']]);
    expect(mockReadFile.mock.calls).toEqual([['test.txt']]);
  });

  test('Can write to existing file', async () => {
    mockDirExists.mockReturnValue(true);
    mockConfirm.mockResolvedValue(false).mockResolvedValueOnce(true);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch"),
    ).resolves.toBeTruthy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue("Ford I think I'm a couch")],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will overwrite the file',
        )}) [y/n]`,
      ],
    ]);

    expect(mockDirExists.mock.calls).toEqual([
      [normalize('/path/to/test.txt')],
      [normalize('/path/to')],
    ]);

    expect(mockWriteFile.mock.calls).toEqual([
      ['/path/to/test.txt', "Ford I think I'm a couch"],
    ]);
  });

  test('Can write to new file', async () => {
    mockDirExists.mockReturnValue(true).mockReturnValueOnce(false);
    mockConfirm.mockResolvedValue(false).mockResolvedValueOnce(true);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch"),
    ).resolves.toBeTruthy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue("Ford I think I'm a couch")],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will create the file',
        )}) [y/n]`,
      ],
    ]);

    expect(mockDirExists.mock.calls).toEqual([
      [normalize('/path/to/test.txt')],
      [normalize('/path/to')],
    ]);

    expect(mockWriteFile.mock.calls).toEqual([
      ['/path/to/test.txt', "Ford I think I'm a couch"],
    ]);
  });

  test('Can write data to file', async () => {
    mockDirExists.mockReturnValue(true).mockReturnValueOnce(false);
    mockConfirm.mockResolvedValue(false).mockResolvedValueOnce(true);

    await expect(
      saveFile('/path/to/test.txt', { foo: 'bar' }),
    ).resolves.toBeTruthy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue({ foo: 'bar' })],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will create the file',
        )}) [y/n]`,
      ],
    ]);

    expect(mockDirExists.mock.calls).toEqual([
      [normalize('/path/to/test.txt')],
      [normalize('/path/to')],
    ]);

    expect(mockWriteFile.mock.calls).toEqual([
      ['/path/to/test.txt', JSON.stringify({ foo: 'bar' }, null, 2)],
    ]);
  });

  test('Can write to file and create directory', async () => {
    mockDirExists.mockReturnValue(false);
    mockConfirm.mockResolvedValue(true);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch"),
    ).resolves.toBeTruthy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue("Ford I think I'm a couch")],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will create the file',
        )}) [y/n]`,
      ],
      [chalk.bold(`Directory /path/to does not exist. Create it? [y/n]`)],
    ]);

    expect(mockCreateDir.mock.calls).toEqual([
      ['/path/to', { recursive: true }],
    ]);

    expect(mockWriteFile.mock.calls).toEqual([
      ['/path/to/test.txt', "Ford I think I'm a couch"],
    ]);
  });

  test('Can write to file by forcing (both file and directory)', async () => {
    mockDirExists.mockReturnValue(false);
    mockConfirm.mockResolvedValue(true);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch", true),
    ).resolves.toBeTruthy();

    expect(mockLog).not.toHaveBeenCalled();

    expect(mockConfirm).not.toHaveBeenCalled();

    expect(mockCreateDir.mock.calls).toEqual([
      ['/path/to', { recursive: true }],
    ]);

    expect(mockWriteFile.mock.calls).toEqual([
      ['/path/to/test.txt', "Ford I think I'm a couch"],
    ]);
  });

  test('Will not write to file when user declines creating file', async () => {
    mockDirExists.mockReturnValue(true).mockReturnValueOnce(false);
    mockConfirm.mockResolvedValue(false);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch"),
    ).resolves.toBeFalsy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue("Ford I think I'm a couch")],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will create the file',
        )}) [y/n]`,
      ],
    ]);

    expect(mockCreateDir).not.toHaveBeenCalled();
    expect(mockWriteFile).not.toHaveBeenCalled();
  });

  test('Will not write to file when user declines creating directory', async () => {
    mockDirExists.mockReturnValue(false);
    mockConfirm.mockResolvedValue(false).mockResolvedValueOnce(true);

    await expect(
      saveFile('/path/to/test.txt', "Ford I think I'm a couch"),
    ).resolves.toBeFalsy();

    expect(mockLog.mock.calls).toEqual([
      ['Confirm saving:'],
      [dumpValue("Ford I think I'm a couch")],
    ]);

    expect(mockConfirm.mock.calls).toEqual([
      [
        `To /path/to/test.txt (${chalk.yellow(
          'This will create the file',
        )}) [y/n]`,
      ],
      [chalk.bold(`Directory /path/to does not exist. Create it? [y/n]`)],
    ]);

    expect(mockCreateDir).not.toHaveBeenCalled();

    expect(mockWriteFile).not.toHaveBeenCalled();
  });
});
