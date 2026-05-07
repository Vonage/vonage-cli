import { faker } from '@faker-js/faker';
import { mockConsole } from '../helpers.js';

describe('Utils: File system', () => {
  const confirm = jest.fn();

  beforeEach(() => {
    mockConsole();
    confirm.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Will write file', async () => {
    const fsMock = jest.createMockFromModule('node:fs');
    const { writeFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();

    await writeFile(testFile, 'new data');

    expect(confirm).not.toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(testFile, 'new data');
  });

  test('Will confirm before writing file', async () => {
    const fsMock = jest.createMockFromModule('node:fs');
    const { writeFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();

    fsMock.existsSync.mockReturnValueOnce(true);
    confirm.mockResolvedValueOnce(true);

    await writeFile(testFile, 'new data');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(fsMock.existsSync).toHaveBeenCalledWith(testFile);
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(testFile, 'new data');
  });

  test('Will confirm before writing file but not write when user declines', async () => {
    const fsMock = jest.createMockFromModule('node:fs');
    const { writeFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();

    fsMock.existsSync.mockReturnValueOnce(true);
    confirm.mockResolvedValueOnce(false);

    await expect(() => writeFile(testFile, 'new data')).rejects.toThrow('User declined to overwrite file');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(fsMock.writeFileSync).not.toHaveBeenCalled();
  });

  test('Will write JSON file', async () => {
    const fsMock = jest.createMockFromModule('node:fs');
    const { writeJSONFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();
    await writeJSONFile(testFile, { foo: 'bar' });
    expect(confirm).not.toHaveBeenCalled();
    expect(fsMock.writeFileSync).toHaveBeenCalledWith(
      testFile,
      JSON.stringify(
        { foo: 'bar' },
        null,
        2,
      ),
    );
  });
});
