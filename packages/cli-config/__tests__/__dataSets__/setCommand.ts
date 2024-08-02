import { ConfigParams } from '../../lib/enums';
import { normalize } from 'path';
import { dumpValue, dumpCommand } from '../../lib/ux';

const config = Object.freeze({
  [ConfigParams.API_KEY]: 'api key',
  [ConfigParams.API_SECRET]: 'api secret',
  [ConfigParams.PRIVATE_KEY]: '/path/to/key',
  [ConfigParams.APPLICATION_ID]: 'app-id',
  CONFIG_SCHEMA_VERSION: '2023-03-30',
});

import kebabcase from 'lodash.kebabcase';

const globalConfigDir = normalize(`${process.env.XDG_CONFIG_HOME}/@oclif/core`);
const globalConfigFile = normalize(`${globalConfigDir}/vonage.config.json`);

const localConfigDir = process.cwd();
const localConfigFile = normalize(`${localConfigDir}/vonage_app.json`);

export default [
  ...Object.values(ConfigParams)
    .map((value) => [
      {
        label: `set ${kebabcase(value)} global config`,
        commandArgs: [kebabcase(value), 'foo', '--global'],
        mockPathExists: true,
        mockSaveFile: true,
        config: { ...config },
        expectedConfig: [
          globalConfigFile,
          {
            ...config,
            [value]: 'foo',
          },
          false,
        ],
        expectedOutput: [
          [`Setting global ${value} to: foo`],
          [`The current setting is: ${dumpValue(config[value])}`],
          ['Config file updated! ✅'],
        ],
      },
      {
        label: `set ${kebabcase(value)} local config`,
        commandArgs: [kebabcase(value), 'foo'],
        mockPathExists: true,
        mockSaveFile: true,
        config: { ...config },
        expectedConfig: [
          localConfigFile,
          {
            ...config,
            [value]: 'foo',
          },
          false,
        ],
        expectedOutput: [
          [`Setting local ${value} to: foo`],
          [`The current setting is: ${dumpValue(config[value])}`],
          ['Config file updated! ✅'],
        ],
      },
    ])
    .flat(),
  {
    label: 'not set local config when file is not present',
    commandArgs: [kebabcase(ConfigParams.API_KEY), 'foo'],
    mockPathExists: false,
    mockSaveFile: true,
    config: { ...config },
    expectedConfig: false,
    expectedOutput: [
      [
        `You need to run ${dumpCommand('vonage config:setup')} before you can set a value`,
      ],
      [''],
      ['You can set DEBUG=* for more information'],
    ],
  },
  {
    label: 'not set global config when file is not present',
    commandArgs: [kebabcase(ConfigParams.API_KEY), 'foo', '--global'],
    mockPathExists: false,
    mockSaveFile: true,
    config: { ...config },
    expectedConfig: false,
    expectedOutput: [
      [
        `You need to run ${dumpCommand('vonage config:setup --global')} before you can set a value`,
      ],
      [''],
      ['You can set DEBUG=* for more information'],
    ],
  },
];
