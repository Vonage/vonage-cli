process.env.FORCE_COLOR = false;
process.env.NODE_DISABLE_COLORS = true;

import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { EOL } from 'os';
import { faker } from '@faker-js/faker';

test('UX: table', async (ctx) => {
  const descriptionList = mock.fn(() => false);
  ctx.mock.module('../../src/ux/descriptionList.js', {
    namedExports: { descriptionList },
  });

  const {
    table,
    defaultBorders,
    defaultDataFormatter,
    defaultHeaderFormatter,
  } = await import('../../src/ux/table.js');

  ctx.beforeEach(() => {
    descriptionList.mock.resetCalls();
  });

  await ctx.test('Will format header and data values by default', () => {
    assert.strictEqual(defaultHeaderFormatter('name'), 'name');
    assert.strictEqual(defaultDataFormatter('name', 'value'), 'value');
    assert.strictEqual(defaultDataFormatter('name', undefined), '');
  });

  await ctx.test('Will return a string', async () => {
    const data = [
      { id: faker.string.alpha(10), desc: faker.string.alpha(10) },
      { id: faker.string.alpha(10), desc: faker.string.alpha(10) },
    ];

    const results = await table(data);
    assert.strictEqual(results, [
      ' id          desc       ',
      `${defaultBorders.horizontal}`.repeat(24),
      ` ${data[0].id}  ${data[0].desc} `,
      ` ${data[1].id}  ${data[1].desc} `,
    ].join(EOL));
  });

  await ctx.test('Will return undefined when called with bad data', async () => {
    assert(await table({ id: '1' }) === undefined);
    assert(await table() === undefined);
  });

  await ctx.test('Will render bordered tables with custom formatters', async () => {
    const result = await table(
      [{ id: '1', desc: 'x' }],
      {
        headerBorders: { horizontal: '-', vertical: '|' },
        dataBorders: { horizontal: '-', vertical: '|' },
        formatHeaderCell: (key) => key.toUpperCase(),
        formatDataCell: (key, value) => `${key}:${value}`,
      },
    );

    assert.strictEqual(result, [
      '| ID   | DESC   |',
      '-----------------',
      '| id:1 | desc:x |',
    ].join(EOL));
  });

  await ctx.test('Will render plain output without borders when requested', async () => {
    const result = await table([
      { id: '1', desc: 'x' },
      { id: '22', desc: 'yy' },
    ], { isPlain: true, isScreenReader: false });

    assert.strictEqual(result, [
      'id  desc',
      '1   x   ',
      '22  yy  ',
    ].join(EOL));
  });

  await ctx.test('Will return early for screen reader mode', async () => {
    const result = await table([{ id: '1' }, { id: '2' }], { isScreenReader: true });

    assert.strictEqual(result, undefined);
    assert.strictEqual(descriptionList.mock.calls.length, 2);
  });
});
