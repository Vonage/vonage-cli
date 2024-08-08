const chalk = require('chalk');

module.exports = [
  {
    label: 'dump string',
    value: 'Vonage CLI',
    expected: chalk.blue('Vonage CLI'),
  },
  {
    label: 'dump number',
    value: 42,
    expected: chalk.dim('42'),
  },
  {
    label: 'dump value',
    value: null,
    expected: chalk.dim.yellow('Not Set'),
  },
  {
    label: 'dump array',
    value: ['fizz', 'buzz', 42, null, undefined],
    expected: [
      `${chalk.yellow('[')}`,
      `  ${chalk.blue('fizz')}`,
      `  ${chalk.blue('buzz')}`,
      `  ${chalk.dim('42')}`,
      `  ${chalk.dim.yellow('Not Set')}`,
      `  ${chalk.dim.yellow('Not Set')}`,
      `${chalk.yellow(']')}`,
    ].join('\n'),
  },
  {
    label: 'dump object',
    value: {
      fizz: 'buzz',
      foo: 'bar',
    },
    expected: [
      `${chalk.yellow('{')}`,
      `  ${chalk.bold('fizz')}: ${chalk.blue('buzz')}`,
      `  ${chalk.bold('foo')}: ${chalk.blue('bar')}`,
      `${chalk.yellow('}')}`,
    ].join('\n'),
  },
  {
    label: 'dump complex array',
    value: [
      'fizz',
      'buzz',
      42,
      null,
      undefined,
      ['baz', 'bat'],
      {
        foo: 'bar',
      },
    ],
    expected: [
      `${chalk.yellow('[')}`,
      `  ${chalk.blue('fizz')}`,
      `  ${chalk.blue('buzz')}`,
      `  ${chalk.dim('42')}`,
      `  ${chalk.dim.yellow('Not Set')}`,
      `  ${chalk.dim.yellow('Not Set')}`,
      `  ${chalk.yellow('[')}`,
      `    ${chalk.blue('baz')}`,
      `    ${chalk.blue('bat')}`,
      `  ${chalk.yellow(']')}`,
      `  ${chalk.yellow('{')}`,
      `    ${chalk.bold('foo')}: ${chalk.blue('bar')}`,
      `  ${chalk.yellow('}')}`,
      `${chalk.yellow(']')}`,
    ].join('\n'),
  },
  {
    label: 'dump complex object',
    value: {
      fizz: 'buzz',
      foo: ['bar', 42, null, undefined],
      baz: {
        quz: 42,
        foo: 'bar',
        fizz: {
          buzz: null,
        },
      },
    },
    expected: [
      `${chalk.yellow('{')}`,
      `  ${chalk.bold('fizz')}: ${chalk.blue('buzz')}`,
      `  ${chalk.bold('foo')}: ${chalk.yellow('[')}`,
      `    ${chalk.blue('bar')}`,
      `    ${chalk.dim('42')}`,
      `    ${chalk.dim.yellow('Not Set')}`,
      `    ${chalk.dim.yellow('Not Set')}`,
      `  ${chalk.yellow(']')}`,
      `  ${chalk.bold('baz')}: ${chalk.yellow('{')}`,
      `    ${chalk.bold('quz')}: ${chalk.dim('42')}`,
      `    ${chalk.bold('foo')}: ${chalk.blue('bar')}`,
      `    ${chalk.bold('fizz')}: ${chalk.yellow('{')}`,
      `      ${chalk.bold('buzz')}: ${chalk.dim.yellow('Not Set')}`,
      `    ${chalk.yellow('}')}`,
      `  ${chalk.yellow('}')}`,
      `${chalk.yellow('}')}`,
    ].join('\n'),
  },
];
