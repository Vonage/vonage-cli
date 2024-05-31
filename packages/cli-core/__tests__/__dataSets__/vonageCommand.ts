import chalk from 'chalk';
import {
  MissingApplicationIdError,
  MissingPrivateKeyError,
  InvalidApplicationIdError,
  InvalidPrivateKeyError,
} from '@vonage/jwt';

export default [
  {
    label: 'help with Missing Application Id',
    error: new MissingApplicationIdError(),
    expected: [
      ['You do not have an application id set!'],
      [''],
      ['To fix this error you can:'],
      [`1. Run ${chalk.green('vonage config:set application-id <value>')}`],
      [
        `2. Run this command again and pass in the application id using ${chalk.green('--application-id=<value>')}`,
      ],
      [
        `3. Set the ${chalk.green('VONAGE_APPLICATION_ID')} environment variable`,
      ],
    ],
  },
  {
    label: 'help with Invalid Application Id',
    error: new InvalidApplicationIdError(),
    expected: [
      ['The application id is invalid!'],
      [''],
      ['Check that you have the correct application id and try again'],
    ],
  },
  {
    label: 'help with Invalid Private Key',
    error: new InvalidPrivateKeyError(),
    expected: [
      ['The private key is invalid!'],
      [
        'Check that you have the correct private key and run this command again',
      ],
      [
        `${chalk.bold('Note:')} The private key can be a path to the file or the value of the private key`,
      ],
    ],
  },
  {
    label: 'help with Missing Private Key',
    error: new MissingPrivateKeyError(),
    expected: [
      ['You do not have the private key set!'],
      [
        `${chalk.bold('Note:')} The private key can be a path to the file or the value of the private key`,
      ],
      [''],
      ['To fix this error you can:'],
      [`1. Run ${chalk.green('vonage config:set private-key <value>')}`],
      [
        `2. Run this command again and pass in the private key using ${chalk.green('--private-key=<value>')}`,
      ],
      [`3. Set the ${chalk.green('VONAGE_PRIVATE_KEY')} environment variable`],
    ],
  },
  {
    label: 'report error',
    error: new Error('I am Error'),
    expected: [['An error occurred: I am Error']],
  },
];
