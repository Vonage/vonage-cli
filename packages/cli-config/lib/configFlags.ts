import { Flags } from '@oclif/core';
import { ConfigParts, ConfigParams } from '@vonage/cli-config';

export const readConfigFlags = {
  part: Flags.string({
    summary: 'Only show the value from this domain',
    options: Object.values(ConfigParts),
    multiple: true,
  }),
  setting: Flags.string({
    summary: 'Only show this setting',
    multiple: true,
    options: Object.values(ConfigParams).map((value) => value.replace('_', '-').toLowerCase()),
  }),
};

export const writeConfigFlags = {
  global: Flags.boolean({
    char: 'g',
    summary: 'Write the global config file',
    allowNo: false,
  }),
};
