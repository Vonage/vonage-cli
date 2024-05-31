import { ux } from '@oclif/core';
import { Flags } from '@oclif/core';
import { icon, brand } from './logo';
import { curry2, curry3 } from './fpUtils';
import terminalLink from 'terminal-link';
import { buildReadline } from './getReadline';
import {
  dumpCommand,
  dumpObject,
  dumpArray,
  dumpKey,
  dumpValue,
} from './dump';
import { TruncateStringCurry, truncateString } from './truncate';
import { ConfirmCurry, confirm } from './confirm';
import { PromptCurry, prompt } from './prompt';
export * from './truncate';
export * from './dump';
export * from './confirm';
export * from './prompt';

const logo = `${icon}\n\n${brand}`;

const developerLink = terminalLink('developer', 'https://developer.vonage.com');

const cliLink = terminalLink('CLI', 'https://github.com/vonage/vonage-cli');

export const UXFlags = {
  truncate: Flags.integer({
    summary: 'Truncate long strings',
    description: 'Truncate long strings to a specific length. This flag will truncate long strings to the specified length. This is useful when you have long strings that you want to display in a table or list. Set to 0 to disable truncation.',
    default: 0,
    helpGroup: 'UX',
  }),

  force: Flags.boolean({
    summary: 'Force the action',
    description: 'Never ask for confirmation, just do it. This flag will bypass any confirmation prompts and will execute the action immediately.',
    default: true,
    helpGroup: 'UX',
  }),

  'screen-reader': Flags.boolean({
    summary: 'Enable screen reader mode',
    description: 'This flag will enable screen reader mode. If set, the output will be optimized for screen readers. Interactive elements will still be used however, the means by which they are interacted with will be optimized for screen readers.',
    default: false,
    helpGroup: 'Accessibility',
  }),

  'color': Flags.boolean({
    summary: 'Enable color output',
    description: `This flag will enable color output. It follows the boolean value from the ${terminalLink('chalk', 'https://github.com/chalk/chalk?tab=readme-ov-file#chalklevel')} library. The Vonage CLI will not interact with this flag at all`,
    default: true,
    helpGroup: 'UX',
  }),

  debug: Flags.boolean({
    summary: 'Enable debug output',
    description: 'This flag will enable debug output. It will output additional information to the console. This is useful for debugging issues with the Vonage CLI.',
    default: false,
    helpGroup: 'UX',
  }),

  verbose: Flags.boolean({
    summary: 'Enable verbose output',
    description: 'This flag will enable verbose output. It will output additional information to the console.',
    default: false,
    helpGroup: 'UX',
  }),
};

// Allow for programmatic access to the flags
// We are not always in the oclif framework
export const defaultUXFlags = {
  truncate: 0,
  force: true,
  'screen-reader': false,
  debug: false,
  verbose: false,
};

export type UXFactory =  {
  dumpObject: typeof dumpObject,
  dumpArray: typeof dumpArray,
  dumpKey: typeof dumpKey,
  dumpValue: typeof dumpValue,
  dumpCommand: typeof dumpCommand,
  truncateString: TruncateStringCurry,
  icon: string,
  brand: string,
  logo: string,
  developerLink: string,
  cliLink: string,
  log: typeof ux.stderr,
  debug: typeof ux.stderr,
  verbose: typeof ux.stderr,
  confirm: ConfirmCurry,
  prompt: PromptCurry,
}

export const UXFactory = (flags?: Partial<typeof UXFlags | typeof defaultUXFlags>): UXFactory => {
  const { 
    force,
    truncate,
    'screen-reader': screenReader,
    debug: debugFlag,
    verbose: verboseFlag,
  } =  flags || defaultUXFlags;

  const confirmCurry = curry3(confirm)(buildReadline())(Boolean(force));
  const promptCurry = curry2(prompt)(buildReadline());

  return {
    dumpObject: dumpObject,
    dumpArray: dumpArray,
    dumpKey: dumpKey,
    dumpValue: dumpValue,
    dumpCommand: dumpCommand,
    truncateString: curry2(truncateString)(Number(truncate)),
    icon: screenReader ? 'A stylized V' : icon,
    brand: screenReader ? 'Vonage' : brand,
    logo: screenReader ? 'Vonage' : logo,
    developerLink: developerLink,
    cliLink: cliLink,
    log: ux.stdout,
    debug: (str?: string | string[] | undefined, ...args: string[]): void => {
      if (!debugFlag) {
        return;
      }

      ux.stderr(str, ...args);
    },
    verbose: (str?: string | string[] | undefined, ...args: string[]): void => {
      if (!verboseFlag) {
        return;
      }

      ux.stderr(str, ...args);
    },
    confirm: confirmCurry,
    prompt: promptCurry,
  };
};
