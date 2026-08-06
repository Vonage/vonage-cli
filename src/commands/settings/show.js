import { getSettings } from '../../utils/settings.js';
import { getSharedConfig } from '../../middleware/config.js';
import { descriptionList } from '../../ux/descriptionList.js';
import { dumpCommand } from '../../ux/dump.js';
import { dumpOnOff } from '../../ux/dumpYesNo.js';

export const command = 'show';

export const desc = 'Show the global CLI settings';

export const builder = (yargs) => yargs
  .example(
    dumpCommand('vonage settings show'),
    'Show the current CLI settings',
  );

export const handler = () => {
  console.info('Displaying global CLI settings');
  const settings = getSettings();
  const { settingsFile } = getSharedConfig();

  console.log(`Global settings file: ${settingsFile}`);
  console.log('');
  console.log(descriptionList({
    'Color Output': dumpOnOff(!settings.color),
    'Emoji Output': dumpOnOff(!settings.emoji),
    'Redaction': dumpOnOff(!settings.redact),
  }));
};
