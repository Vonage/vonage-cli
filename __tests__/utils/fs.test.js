import { faker } from '@faker-js/faker';
import { mockConsole } from '../helpers.js';

describe('Utils: File system', () => {
  const confirm = mock.fn();

  beforeEach(() => {
    mockConsole();
    confirm.mock.resetCalls();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
  });

  test('Will write file', async () => {
    const fsMock = { writeFileSync: mock.fn(), existsSync: mock.fn(), readFileSync: mock.fn() };
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

    assert.strictEqual(confirm.mock.callCount(), 0);
    assertCalledWith(fsMock.writeFileSync, testFile, 'new data');
  });

  test('Will confirm before writing file', async () => {
    const fsMock = { writeFileSync: mock.fn(), existsSync: mock.fn(), readFileSync: mock.fn() };
    const { writeFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();

    fsMock.existsSync.mock.mockImplementationOnce(() => true);
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await writeFile(testFile, 'new data');
    assertCalledWith(confirm, `Overwirte file ${testFile}?`);
    assertCalledWith(fsMock.existsSync, testFile);
    assertCalledWith(fsMock.writeFileSync, testFile, 'new data');
  });

  test('Will confirm before writing file but not write when user declines', async () => {
    const fsMock = { writeFileSync: mock.fn(), existsSync: mock.fn(), readFileSync: mock.fn() };
    const { writeFile } = await loadModule(
      import.meta.url,
      '../../src/utils/fs.js',
      {
        'fs': fsMock,
        '../../src/ux/confirm.js': { confirm },
      },
    );

    const testFile = faker.system.filePath();

    fsMock.existsSync.mock.mockImplementationOnce(() => true);
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await assert.rejects(() => writeFile(testFile, 'new data'), /User declined to overwrite file/);
    assertCalledWith(confirm, `Overwirte file ${testFile}?`);
    assert.strictEqual(fsMock.writeFileSync.mock.callCount(), 0);
  });

  test('Will write JSON file', async () => {
    const fsMock = { writeFileSync: mock.fn(), existsSync: mock.fn(), readFileSync: mock.fn() };
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
    assert.strictEqual(confirm.mock.callCount(), 0);
    assertCalledWith(
      fsMock.writeFileSync,
      testFile,
      JSON.stringify(
        { foo: 'bar' },
        null,
        2,
      ),
    );
  });
});
