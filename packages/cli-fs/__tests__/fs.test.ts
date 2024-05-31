import { jest, expect } from '@jest/globals';
import {
  pathExists,
  loadFile,
  FSFactory,
  defaultFSFlags,
  checkDirectoryExistsForFile,
  makeDirectory,
  makeDirectoryForFile,
  MakeDirectoryCurry,
  saveFile,
  CheckDirectoryExistsForFileCurry,
  MakeDirectoryForFileCurry,
} from '../lib';
import {
  confirm,
  ConfirmCurry,
} from '@vonage/cli-ux';
import {
  existsMock,
  normalizeMock,
  readFileMock,
  parseMock,
  makeDirMock,
  writeFileMock,
} from '../../../testHelpers/mocks';
import { ParsedPath } from 'node:path';
import {
  NodeReadFile,
  NodeMkdir,
  NodeWriteFile,
} from '../lib/nodeTypes';

const checkDirectoryExistsForFileMock = jest.fn(checkDirectoryExistsForFile);
const makdDirectoryForFileMock = jest.fn(makeDirectoryForFile);
const confirmMock = jest.fn(confirm);

describe('File System tests', () => {
  afterEach(() => {
    confirmMock.mockClear();
    checkDirectoryExistsForFileMock.mockClear();
    makdDirectoryForFileMock.mockClear();
  });

  test('PathExists returns true when file exists', () => {
    expect(pathExists(
      existsMock.mockReturnValue(true),
      normalizeMock.mockReturnValue('test.txt'),
      'test.txt'
    )).toBe(true);

    expect(FSFactory(defaultFSFlags)).toHaveProperty('pathExists');
  });

  test('LoadFile returns file contents', () => {
    expect(loadFile(
      existsMock.mockReturnValue(true),
      readFileMock.mockReturnValue('Ford I think I\'m a couch') as NodeReadFile,
      normalizeMock.mockReturnValue('test.txt'),
      'test.txt'
    )).toBe('Ford I think I\'m a couch');

    expect(FSFactory(defaultFSFlags)).toHaveProperty('loadFile');
  });

  test('LoadFile returns null when file does not exist', () => {
    expect(loadFile(
      existsMock.mockReturnValue(false),
      readFileMock as NodeReadFile,
      normalizeMock.mockReturnValue('test.txt'),
      'test.txt'
    )).toBeNull();
  });

  test('CheckDirectoryExistsForFile returns true when directory exists', () => {
    const path = {
      root: '/',
      dir: '/',
      base: '/',
      ext: '/',
      name: '/',
    } as ParsedPath;

    expect(checkDirectoryExistsForFile(
      existsMock.mockReturnValue(true),
      parseMock.mockReturnValue(path),
      'test.txt'
    )).toBe(true);

    expect(FSFactory(defaultFSFlags)).toHaveProperty('checkDirectoryExistsForFile');
  });

  test('CheckDirectoryExistsForFile returns false when directory does not exist', () => {
    const path = {
      root: '/',
      dir: '/',
      base: '/',
      ext: '/',
      name: '/',
    } as ParsedPath;

    expect(checkDirectoryExistsForFile(
      existsMock.mockReturnValue(false),
      parseMock.mockReturnValue(path),
      'test.txt'
    )).toBe(false);
  });

  test('MakeDirectory will create directory', async() => {
    expect(await makeDirectory(
      makeDirMock.mockReturnValue('') as NodeMkdir,
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(true) as unknown as ConfirmCurry,
      false,
      '/path/to'
    )).toBe(true);

    expect(confirmMock).toHaveBeenCalled();
    expect(makeDirMock).toHaveBeenCalledWith('/path/to');
    expect(FSFactory(defaultFSFlags)).toHaveProperty('checkDirectoryExistsForFile');
  });

  test('MakeDirectory will not create directory when declined', async() => {
    expect(await makeDirectory(
      makeDirMock.mockReturnValue('') as NodeMkdir,
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(false) as unknown as ConfirmCurry,
      false,
      '/path/to'
    )).toBe(false);

    expect(confirmMock).toHaveBeenCalled();
    expect(makeDirMock).not.toHaveBeenCalled();
  });

  test('MakeDirectory will create directory when forced', async() => {
    expect(await makeDirectory(
      makeDirMock.mockReturnValue('') as NodeMkdir,
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(false) as unknown as ConfirmCurry,
      true,
      '/path/to'
    )).toBe(true);

    expect(confirmMock).not.toHaveBeenCalled();
    expect(makeDirMock).toHaveBeenCalledWith('/path/to');
  });

  test('MakeDirectoryForFile will create directory', async() => {
    const mockMakeDirectory = jest.fn(makeDirectory).mockResolvedValue(true);
    expect(await makeDirectoryForFile(
      mockMakeDirectory as unknown as MakeDirectoryCurry,
      parseMock.mockReturnValue({
        root: '/',
        dir: '/path/to',
        base: 'file.txt',
        ext: 'txt',
        name: 'file',
      }),
      '/path/to/file.txt'
    )).toBe(true);

    expect(mockMakeDirectory).toHaveBeenCalledWith('/path/to');
    expect(FSFactory(defaultFSFlags)).toHaveProperty('makeDirectoryForFile');
  });

  test('SaveFile will save', async() => {
    expect(await saveFile(
      normalizeMock.mockReturnValue('/path/to/file.txt'),
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(true) as unknown as ConfirmCurry,
      checkDirectoryExistsForFileMock.mockReturnValue(true) as unknown as CheckDirectoryExistsForFileCurry,
      makdDirectoryForFileMock.mockResolvedValue(true) as unknown as MakeDirectoryForFileCurry,
      writeFileMock.mockReturnValue() as NodeWriteFile,
      false,
      '/path/to/file.txt',
      'This is some data',
    )).toBe(true);

    // This will always be called. The force will be used in the confirm
    expect(confirmMock).toHaveBeenCalled();
    expect(writeFileMock).toHaveBeenCalledWith('/path/to/file.txt', 'This is some data');
    expect(FSFactory(defaultFSFlags)).toHaveProperty('saveFile');
  });

  test('SaveFile will not save when confirm is false', async() => {
    expect(await saveFile(
      normalizeMock.mockReturnValue('/path/to/file.txt'),
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(false) as unknown as ConfirmCurry,
      checkDirectoryExistsForFileMock.mockReturnValue(true) as unknown as CheckDirectoryExistsForFileCurry,
      makdDirectoryForFileMock.mockResolvedValue(true) as unknown as MakeDirectoryForFileCurry,
      writeFileMock.mockReturnValue() as NodeWriteFile,
      false,
      '/path/to/file.txt',
      'This is some data',
    )).toBe(false);

    // This will always be called. The force will be used in the confirm
    expect(confirmMock).toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  test('SaveFile will not save when directory does not exist', async() => {
    expect(await saveFile(
      normalizeMock.mockReturnValue('/path/to/file.txt'),
      existsMock.mockReturnValue(false),
      confirmMock.mockResolvedValue(true) as unknown as ConfirmCurry,
      checkDirectoryExistsForFileMock.mockReturnValue(false) as unknown as CheckDirectoryExistsForFileCurry,
      makdDirectoryForFileMock.mockResolvedValue(false) as unknown as MakeDirectoryForFileCurry,
      writeFileMock.mockReturnValue() as NodeWriteFile,
      false,
      '/path/to/file.txt',
      'This is some data',
    )).toBe(false);

    // This will always be called. The force will be used in the confirm
    expect(confirmMock).toHaveBeenCalled();
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});
