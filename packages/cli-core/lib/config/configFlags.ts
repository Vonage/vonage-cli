import { Flags } from '@oclif/core';

export const configFlags = {
  'api-key': Flags.string({
    aliases: ['apiKey'],
    summary: 'API Key to use',
    helpGroup: 'CONFIGURATION',
    deprecateAliases: true,
  }),
  'api-secret': Flags.string({
    summary: 'API Secret to use',
    helpGroup: 'CONFIGURATION',
    dependsOn: ['api-key'],
  }),
  'private-key': Flags.file({
    summary: 'Private key file to use',
    helpGroup: 'CONFIGURATION',
    dependsOn: ['application-id', 'api-key'],
    aliases: ['key_file'],
    deprecateAliases: true,
  }),
  'application-id': Flags.file({
    aliases: ['app-id', 'app_id'],
    summary: 'Application id to use',
    helpGroup: 'CONFIGURATION',
  }),
};
