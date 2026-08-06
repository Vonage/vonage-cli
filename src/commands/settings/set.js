import { saveSettingsFile, setSetting } from '../../utils/settings.js';
import { dumpCommand } from '../../ux/dump.js';

const settingKeys = [
  'color',
  'emoji',
  'redact',
];

export const command = 'set <key> <value>';

export const desc = 'Set a global CLI setting';

export const builder = (yargs) => yargs
  .positional('key', {
    describe: 'The setting to update',
    choices: settingKeys,
    type: 'string',
  })
  .positional('value', {
    describe: 'The value to store',
    choices: ['on', 'off'],
    type: 'string',
  })
  .example(
    dumpCommand('vonage settings set color off'),
    'Turn color output off by default',
  )
  .example(
    dumpCommand('vonage settings set redact on'),
    'Keep redaction enabled by default',
  );

export const handler = (argv) => {
  console.info(`Updating global CLI setting ${argv.key}`);

  setSetting(argv.key, argv.value === 'on');
  saveSettingsFile();

  console.log(`Saved ${argv.key}=${argv.value}`);
};
