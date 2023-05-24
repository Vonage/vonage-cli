import { ConfigParams } from '../../lib/enums';
import { normalize } from 'path';
import { dumpValue } from '../../lib/ux';
import chalk from 'chalk';

const globalConfig = {
  [normalize(`${process.cwd()}/test/@vonage/cli-core/vonage.config.json`)]: {
    [ConfigParams.API_KEY]: 'global-key',
    [ConfigParams.API_SECRET]: 'global-secret',
    [ConfigParams.APPLICATION_ID]: 'global-application',
    [ConfigParams.PRIVATE_KEY]: 'global-private-key',
  },
};

const localConfig = {
  [normalize(`${process.cwd()}/vonage_app.json`)]: {
    [ConfigParams.API_KEY]: 'local-key',
    [ConfigParams.API_SECRET]: 'local-secret',
    [ConfigParams.APPLICATION_ID]: 'local-application',
    [ConfigParams.PRIVATE_KEY]: 'local-private-key',
  },
};

const globalSet = [
  [`${chalk.bold('The global API key is')}: ${dumpValue('global-key')}`],
  [`${chalk.bold('The global API secret is')}: ${dumpValue('global-secret')}`],
  [
    `${chalk.bold('The global application ID is')}: ${dumpValue(
      'global-application',
    )}`,
  ],
  [
    `${chalk.bold('The global private key is')}: ${dumpValue(
      'global-private-key',
    )}`,
  ],
  [''],
];

const globalNotSet = [
  [`${chalk.bold('The global API key is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The global API secret is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The global application ID is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The global private key is')}: ${dumpValue(null)}`],
  [''],
];

const localSet = [
  [`${chalk.bold('The local API key is')}: ${dumpValue('local-key')}`],
  [`${chalk.bold('The local API secret is')}: ${dumpValue('local-secret')}`],
  [
    `${chalk.bold('The local application ID is')}: ${dumpValue(
      'local-application',
    )}`,
  ],
  [
    `${chalk.bold('The local private key is')}: ${dumpValue(
      'local-private-key',
    )}`,
  ],
  [''],
];

const localNotSet = [
  [`${chalk.bold('The local API key is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The local API secret is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The local application ID is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The local private key is')}: ${dumpValue(null)}`],
  [''],
];

const envSet = [
  [`${chalk.bold('The environment API key is')}: ${dumpValue('env-key')}`],
  [
    `${chalk.bold('The environment API secret is')}: ${dumpValue(
      'env-secret',
    )}`,
  ],
  [
    `${chalk.bold('The environment application ID is')}: ${dumpValue(
      'env-app-id',
    )}`,
  ],
  [
    `${chalk.bold('The environment private key is')}: ${dumpValue(
      'env-private-key',
    )}`,
  ],
  [''],
];

const envNotSet = [
  [`${chalk.bold('The environment API key is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The environment API secret is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The environment application ID is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The environment private key is')}: ${dumpValue(null)}`],
  [''],
];

const argsSet = [
  [`${chalk.bold('The arguments API key is')}: ${dumpValue('args-key')}`],
  [`${chalk.bold('The arguments API secret is')}: ${dumpValue('args-secret')}`],
  [
    `${chalk.bold('The arguments application ID is')}: ${dumpValue(
      'args-app-id',
    )}`,
  ],
  [
    `${chalk.bold('The arguments private key is')}: ${dumpValue(
      'args-private-key',
    )}`,
  ],
  [''],
];

const argsNotSet = [
  [`${chalk.bold('The arguments API key is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The arguments API secret is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The arguments application ID is')}: ${dumpValue(null)}`],
  [`${chalk.bold('The arguments private key is')}: ${dumpValue(null)}`],
  [''],
];
export default [
  {
    label: 'use global config',
    commandArgs: ['--verbose'],
    config: globalConfig,
    expected: [
      ...globalSet,
      ...localNotSet,
      ...envNotSet,
      ...argsNotSet,
      [`${chalk.bold('The API key is')}: ${dumpValue('global-key')}`],
      [`${chalk.bold('The API secret is')}: ${dumpValue('global-secret')}`],
      [
        `${chalk.bold('The application ID is')}: ${dumpValue(
          'global-application',
        )}`,
      ],
      [
        `${chalk.bold('The private key is')}: ${dumpValue(
          'global-private-key',
        )}`,
      ],
      [''],
    ],
    clearEnv: true,
  },
  {
    label: 'use local config',
    commandArgs: ['--verbose'],
    config: localConfig,
    expected: [
      ...globalNotSet,
      ...localSet,
      ...envNotSet,
      ...argsNotSet,
      [`${chalk.bold('The API key is')}: ${dumpValue('local-key')}`],
      [`${chalk.bold('The API secret is')}: ${dumpValue('local-secret')}`],
      [
        `${chalk.bold('The application ID is')}: ${dumpValue(
          'local-application',
        )}`,
      ],
      [
        `${chalk.bold('The private key is')}: ${dumpValue(
          'local-private-key',
        )}`,
      ],
      [''],
    ],
    clearEnv: true,
  },
  {
    label: 'use environment variables ',
    commandArgs: ['--verbose'],
    config: {},
    expected: [
      ...globalNotSet,
      ...localNotSet,
      ...envSet,
      ...argsNotSet,
      [`${chalk.bold('The API key is')}: ${dumpValue('env-key')}`],
      [`${chalk.bold('The API secret is')}: ${dumpValue('env-secret')}`],
      [`${chalk.bold('The application ID is')}: ${dumpValue('env-app-id')}`],
      [`${chalk.bold('The private key is')}: ${dumpValue('env-private-key')}`],
      [''],
    ],
    clearEnv: false,
  },
  {
    label: 'use argument flags',
    commandArgs: [
      '--verbose',
      '--api-key=args-key',
      '--api-secret=args-secret',
      '--app-id=args-app-id',
      '--private-key=args-private-key',
    ],
    config: {},
    expected: [
      ...globalNotSet,
      ...localNotSet,
      ...envNotSet,
      ...argsSet,
      [`${chalk.bold('The API key is')}: ${dumpValue('args-key')}`],
      [`${chalk.bold('The API secret is')}: ${dumpValue('args-secret')}`],
      [`${chalk.bold('The application ID is')}: ${dumpValue('args-app-id')}`],
      [`${chalk.bold('The private key is')}: ${dumpValue('args-private-key')}`],
      [''],
    ],
    clearEnv: true,
  },
  {
    label: 'follow config precedence',
    commandArgs: [
      '--verbose',
      '--api-key=args-key',
      '--api-secret=args-secret',
      '--app-id=args-app-id',
      '--private-key=args-private-key',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [
      ...globalSet,
      ...localSet,
      ...envSet,
      ...argsSet,
      [`${chalk.bold('The API key is')}: ${dumpValue('args-key')}`],
      [`${chalk.bold('The API secret is')}: ${dumpValue('args-secret')}`],
      [`${chalk.bold('The application ID is')}: ${dumpValue('args-app-id')}`],
      [`${chalk.bold('The private key is')}: ${dumpValue('args-private-key')}`],
      [''],
    ],
    clearEnv: false,
  },
  {
    label: 'only output global',
    commandArgs: ['--part=global', '--verbose'],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: globalSet,
    clearEnv: false,
  },
  {
    label: 'only output local',
    commandArgs: ['--verbose', '--part=local'],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: localSet,
    clearEnv: false,
  },
  {
    label: 'only output environment',
    commandArgs: ['--verbose', '--part=environment'],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: envSet,
    clearEnv: false,
  },
  {
    label: 'only output arguments',
    commandArgs: [
      '--verbose',
      '--part=arguments',
      '--api-key=args-key',
      '--api-secret=args-secret',
      '--app-id=args-app-id',
      '--private-key=args-private-key',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: argsSet,
    clearEnv: false,
  },
  {
    label: 'output environment and arguments',
    commandArgs: [
      '--verbose',
      '--part=arguments',
      '--part=environment',
      '--api-key=args-key',
      '--api-secret=args-secret',
      '--app-id=args-app-id',
      '--private-key=args-private-key',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [...envSet, ...argsSet],
    clearEnv: false,
  },
  {
    label: 'output API key only',
    commandArgs: ['--verbose', '--setting=api-key', '--api-key=args-key'],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [
      globalSet[0],
      [''],
      localSet[0],
      [''],
      envSet[0],
      [''],
      argsSet[0],
      [''],
      [`${chalk.bold('The API key is')}: ${dumpValue('args-key')}`],
      [''],
    ],
    clearEnv: false,
  },
  {
    label: 'output API secret only',
    commandArgs: [
      '--verbose',
      '--setting=api-secret',
      '--api-key=args-key',
      '--api-secret=args-secret',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [
      globalSet[1],
      [''],
      localSet[1],
      [''],
      envSet[1],
      [''],
      argsSet[1],
      [''],
      [`${chalk.bold('The API secret is')}: ${dumpValue('args-secret')}`],
      [''],
    ],
    clearEnv: false,
  },
  {
    label: 'output application id only ',
    commandArgs: [
      '--verbose',
      '--setting=application-id',
      '--app-id=args-app-id',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [
      globalSet[2],
      [''],
      localSet[2],
      [''],
      envSet[2],
      [''],
      argsSet[2],
      [''],
      [`${chalk.bold('The application ID is')}: ${dumpValue('args-app-id')}`],
      [''],
    ],
    clearEnv: false,
  },
  {
    label: 'output private key only ',
    commandArgs: [
      '--verbose',
      '--setting=private-key',
      '--api-key=args-key',
      '--application-id=args-app-id',
      '--private-key=args-private-key',
    ],
    config: {
      ...globalConfig,
      ...localConfig,
    },
    expected: [
      globalSet[3],
      [''],
      localSet[3],
      [''],
      envSet[3],
      [''],
      argsSet[3],
      [''],
      [`${chalk.bold('The private key is')}: ${dumpValue('args-private-key')}`],
      [''],
    ],
    clearEnv: false,
  },
];
