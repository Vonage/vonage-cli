const { faker } = require('@faker-js/faker');
const { writeFileSync } = require('fs');
const {
  writeFile,
  writeJSONFile,
} = require('../../src/utils/fs');
const { confirm } = require('../../src/ux/confirm');
const fs = require('fs');

jest.mock('fs');
jest.mock('../../src/ux/confirm');

describe('Utils: File system', () => {
  test('Will write file', async () => {
    const testFile = faker.system.filePath();
    await writeFile(testFile, 'new data');
    expect(confirm).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(testFile, 'new data');

  });

  test('Will confirm before writing file', async () => {
    const testFile = faker.system.filePath();

    fs.__addFile(testFile, 'test data');

    confirm.mockResolvedValueOnce(true);

    await writeFile(testFile, 'new data');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(writeFileSync).toHaveBeenCalledWith(testFile, 'new data');
  });

  test('Will confirm before writing file but not write when user declines', async () => {
    const testFile = faker.system.filePath();

    fs.__addFile(testFile, 'test data');

    confirm.mockResolvedValueOnce(false);

    await expect(() => writeFile(testFile, 'new data')).rejects.toThrow('User declined to overwrite file');
    expect(confirm).toHaveBeenCalledWith(`Overwirte file ${testFile}?`);
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  test('Will write JSON file', async () => {
    const testFile = faker.system.filePath();
    await writeJSONFile(testFile, {foo: 'bar'});
    expect(confirm).not.toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalledWith(
      testFile,
      JSON.stringify(
        {foo: 'bar'},
        null,
        2,
      ),
    );
  });
});

