import yargs from 'yargs';
import { WhatsAppTemplate } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';
import { coerceJSON } from '../../../../utils/coerceJSON.js';

const y = yargs();

export const command = 'template';

export const desc = 'Send a WhatsApp template message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'policy': {
      describe: 'The WhatsApp policy',
      choices: ['deterministic'],
      type: 'string',
      group: 'WhatsApp Message',
    },
    'locale': {
      describe: 'The WhatsApp locale code',
      type: 'string',
      group: 'WhatsApp Message',
    },
    'name': {
      describe: 'The WhatsApp template name',
      type: 'string',
      group: 'WhatsApp Message',
    },
    'parameters': coerceJSON,
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'policy', 'locale', 'name', 'parameters'])
  .example(
    dumpCommand('vonage message send whatsapp template --to <number> --from <number> --policy <policy> --locale <locale> --name <name> --parameters <json-array>'),
    'Send a WhatsApp template message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp template message to ${argv.to}`);

  if (!Array.isArray(argv.parameters)) {
    console.error('parameters must be a JSON array');
    y.exit(1);
    return;
  }

  await sendMessage(
    argv.SDK,
    new WhatsAppTemplate({
      ...buildWhatsAppMessage(argv),
      whatsapp: {
        policy: argv.policy,
        locale: argv.locale,
      },
      template: {
        name: argv.name,
        parameters: argv.parameters,
      },
    }),
  );
};
