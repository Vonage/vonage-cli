import { ConfigParams } from '../../lib/enums';
import { normalize } from 'path';

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
  'The global API key is: global-key',
  'The global API secret is: global-secret',
  'The global application ID is: global-application',
  'The global private key is: global-private-key',
  '',
];

const globalNotSet = [
  'The global API key is: Not Set',
  'The global API secret is: Not Set',
  'The global application ID is: Not Set',
  'The global private key is: Not Set',
  '',
];

const localSet = [
  'The local API key is: local-key',
  'The local API secret is: local-secret',
  'The local application ID is: local-application',
  'The local private key is: local-private-key',
  '',
];
const localNotSet = [
  'The local API key is: Not Set',
  'The local API secret is: Not Set',
  'The local application ID is: Not Set',
  'The local private key is: Not Set',
  '',
];

const envSet = [
  'The environment API key is: env-key',
  'The environment API secret is: env-secret',
  'The environment application ID is: env-app-id',
  'The environment private key is: env-private-key',
  '',
];

const envNotSet = [
  'The environment API key is: Not Set',
  'The environment API secret is: Not Set',
  'The environment application ID is: Not Set',
  'The environment private key is: Not Set',
  '',
];

const argsSet = [
  'The arguments API key is: args-key',
  'The arguments API secret is: args-secret',
  'The arguments application ID is: args-app-id',
  'The arguments private key is: args-private-key',
  '',
];

const argsNotSet = [
  'The arguments API key is: Not Set',
  'The arguments API secret is: Not Set',
  'The arguments application ID is: Not Set',
  'The arguments private key is: Not Set',
  '',
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
      'The API key is: global-key',
      'The API secret is: global-secret',
      'The application ID is: global-application',
      'The private key is: global-private-key',
      '',
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
      'The API key is: local-key',
      'The API secret is: local-secret',
      'The application ID is: local-application',
      'The private key is: local-private-key',
      '',
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
      'The API key is: env-key',
      'The API secret is: env-secret',
      'The application ID is: env-app-id',
      'The private key is: env-private-key',
      '',
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
      'The API key is: args-key',
      'The API secret is: args-secret',
      'The application ID is: args-app-id',
      'The private key is: args-private-key',
      '',
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
      'The API key is: args-key',
      'The API secret is: args-secret',
      'The application ID is: args-app-id',
      'The private key is: args-private-key',
      '',
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
      '',
      localSet[0],
      '',
      envSet[0],
      '',
      argsSet[0],
      '',
      'The API key is: args-key',
      '',
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
      '',
      localSet[1],
      '',
      envSet[1],
      '',
      argsSet[1],
      '',
      'The API secret is: args-secret',
      '',
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
      '',
      localSet[2],
      '',
      envSet[2],
      '',
      argsSet[2],
      '',
      'The application ID is: args-app-id',
      '',
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
      '',
      localSet[3],
      '',
      envSet[3],
      '',
      argsSet[3],
      '',
      'The private key is: args-private-key',
      '',
    ],
    clearEnv: false,
  },
];
