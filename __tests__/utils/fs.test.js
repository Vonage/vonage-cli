import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../helpers.js';

test('Utils: File system', { concurrency: 1 }, async (ctx) => {
  const confirm = mock.fn();
  const fsMock = {
    writeFileSync: mock.fn(),
    existsSync: mock.fn(),
    readFileSync: mock.fn(),
    mkdirSync: mock.fn(),
  };

  ctx.mock.module('fs', { namedExports: fsMock });
  ctx.mock.module('../../src/ux/confirm.js', { namedExports: { confirm } });
  const { writeFile, writeJSONFile } = await import('../../src/utils/fs.js');

  ctx.beforeEach(() => {
    mockConsole();
    confirm.mock.resetCalls();
    fsMock.writeFileSync.mock.resetCalls();
    fsMock.existsSync.mock.resetCalls();
    fsMock.readFileSync.mock.resetCalls();
    fsMock.mkdirSync.mock.resetCalls();
    fsMock.existsSync.mock.mockImplementation(() => false);
    confirm.mock.mockImplementation(() => Promise.resolve(false));
  });

  await ctx.test('Will write file', async () => {
    const testFile = faker.system.filePath();
    await writeFile(testFile, 'new data');

    assert.strictEqual(confirm.mock.calls.length, 0);
    assert.deepStrictEqual(fsMock.writeFileSync.mock.calls[0].arguments, [testFile, 'new data']);
  });

  await ctx.test('Will confirm before writing file', async () => {
    const testFile = faker.system.filePath();
    fsMock.existsSync.mock.mockImplementationOnce(() => true);
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await writeFile(testFile, 'new data');
    assert.deepStrictEqual(confirm.mock.calls[0].arguments, [`Overwirte file ${testFile}?`]);
    assert.deepStrictEqual(fsMock.existsSync.mock.calls[0].arguments, [testFile]);
    assert.deepStrictEqual(fsMock.writeFileSync.mock.calls[0].arguments, [testFile, 'new data']);
  });

  await ctx.test('Will confirm before writing file but not write when user declines', async () => {
    const testFile = faker.system.filePath();
    fsMock.existsSync.mock.mockImplementationOnce(() => true);
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await assert.rejects(() => writeFile(testFile, 'new data'), /User declined to overwrite file/);
    assert.deepStrictEqual(confirm.mock.calls[0].arguments, [`Overwirte file ${testFile}?`]);
    assert.strictEqual(fsMock.writeFileSync.mock.calls.length, 0);
  });

  await ctx.test('Will write JSON file', async () => {
    const testFile = faker.system.filePath();
    await writeJSONFile(testFile, { foo: 'bar' });
    assert.strictEqual(confirm.mock.calls.length, 0);
    assert.deepStrictEqual(
      fsMock.writeFileSync.mock.calls[0].arguments,
      [testFile, JSON.stringify({ foo: 'bar' }, null, 2)],
    );
  });
});
