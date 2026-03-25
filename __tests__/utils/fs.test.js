import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../helpers.js';

describe('Utils: File system', () => {

  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Will write file', async () => {
    jest.unstable_mockModule('node:fs', () => jest.createMockFromModule('node:fs'));
    jest.unstable_mockModule('../../src/ux/confirm.js', () => ({ confirm: jest.fn() }));

    const { writeFileSync } = await import('node:fs');
    const { confirm } = await import('../../src/ux/confirm.js');

    const testFile = faker.system.filePath();
    const { writeFile } = await import('../../src/utils/fs.js');

    await writeFile(testFile, 'new data');

    expect(confirm).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(testFile, 'new data');
  });

  test('Will confirm before writing file', async () => {
    jest.unstable_mockModule('node:fs', () => jest.createMockFromModule('node:fs'));
    jest.unstable_mockModule('../../src/ux/confirm.js', () => ({ confirm: jest.fn() }));

    const { writeFileSync, existsSync } = await import('node:fs');
    const { confirm } = await import('../../src/ux/confirm.js');

    const testFile = faker.system.filePath();
    const { writeFile } = await import('../../src/utils/fs.js');

    existsSync.mockResolvedValueOnce(true);
    confirm.mockResolvedValueOnce(true);

    await writeFile(testFile, 'new data');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(existsSync).toHaveBeenCalledWith(testFile);
    expect(writeFileSync).toHaveBeenCalledWith(testFile, 'new data');
  });

  test('Will confirm before writing file but not write when user declines', async () => {
    jest.unstable_mockModule('node:fs', () => jest.createMockFromModule('node:fs'));
    jest.unstable_mockModule('../../src/ux/confirm.js', () => ({ confirm: jest.fn() }));

    const { writeFileSync, existsSync } = await import('node:fs');
    const { confirm } = await import('../../src/ux/confirm.js');

    const testFile = faker.system.filePath();
    const { writeFile } = await import('../../src/utils/fs.js');

    existsSync.mockResolvedValueOnce(true);
    confirm.mockResolvedValueOnce(false);

    await expect(() => writeFile(testFile, 'new data')).rejects.toThrow('User declined to overwrite file');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  test('Will write JSON file', async () => {
    jest.unstable_mockModule('node:fs', () => jest.createMockFromModule('node:fs'));
    jest.unstable_mockModule('../../src/ux/confirm.js', () => ({ confirm: jest.fn() }));

    const { writeFileSync } = await import('node:fs');
    const { confirm } = await import('../../src/ux/confirm.js');

    const testFile = faker.system.filePath();
    const { writeJSONFile } = await import('../../src/utils/fs.js');
    await writeJSONFile(testFile, { foo: 'bar' });
    expect(confirm).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      testFile,
      JSON.stringify(
        { foo: 'bar' },
        null,
        2,
      ),
    );
  });
});

