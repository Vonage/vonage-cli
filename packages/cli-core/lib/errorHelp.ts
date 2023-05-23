import chalk from 'chalk';
import { ConfigEnv } from './enums/index';
import {
  MissingApplicationIdError,
  MissingPrivateKeyError,
  InvalidApplicationIdError,
  InvalidPrivateKeyError,
} from '@vonage/jwt';

export const commonErrors = {
  [InvalidPrivateKeyError.name]: [
    'The private key is invalid!',
    `Check that you have the correct private key and run this command again`,

    `${chalk.bold(
      'Note:',
    )} The private key can be a path to the file or the value of the private key`,
  ],

  [MissingPrivateKeyError.name]: [
    'You do not have the private key set!',
    `${chalk.bold(
      'Note:',
    )} The private key can be a path to the file or the value of the private key`,
    '',
    'To fix this error you can:',
    `1. Run ${chalk.green('vonage config:set private-key <value>')}`,
    `2. Run this command again and pass in the private key using ${chalk.green(
      '--private-key=<value>',
    )}`,
    `3. Set the ${chalk.green(ConfigEnv.PRIVATE_KEY)} environment variable`,
  ],

  [MissingApplicationIdError.name]: [
    'You do not have an application id set!',
    '',
    'To fix this error you can:',
    `1. Run ${chalk.green('vonage config:set application-id <value>')}`,
    `2. Run this command again and pass in the application id using ${chalk.green(
      '--application-id=<value>',
    )}`,
    `3. Set the ${chalk.green(ConfigEnv.APPLICATION_ID)} environment variable`,
  ],

  [InvalidApplicationIdError.name]: [
    'The application id is invalid!',
    '',
    'Check that you have the correct application id and try again',
  ],
};
