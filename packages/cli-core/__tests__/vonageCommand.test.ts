import { expect } from '@jest/globals';
import { VonageCommand } from '../lib/vonageCommand';
import {
  MissingApplicationIdError,
  MissingPrivateKeyError,
  InvalidApplicationIdError,
  InvalidPrivateKeyError,
} from '@vonage/jwt';

class TestClass extends VonageCommand<typeof TestClass> {
  public static errorToThrow = null;

  async run(): Promise<void> {
    throw TestClass.errorToThrow;

  }
}

describe('Vonnage command', () => {
  test('Will log defuult message', async () =>{
    TestClass.errorToThrow = new Error('I am Error');
    await expect(() => TestClass.run([])).rejects.toThrow('I am Error');

    expect([
      'An error occurred: I am Error',
      '',
      'You can set DEBUG=* for more information',
    ]).wasOutput();
  });

  test('Will help with Missing Application Id', async () =>{
    TestClass.errorToThrow = new MissingApplicationIdError();
    await TestClass.run([]);

    expect([
      'You do not have an application id set!',
      '',
      'To fix this error you can:',
      `1. Run vonage config:set application-id <value>`,
      `2. Run this command again and pass in the application id using --application-id=<value>`,
      `3. Set the VONAGE_APPLICATION_ID environment variable`,
    ]).wasOutput();
  });

  test('Will help with Invalid Application Id', async () =>{
    TestClass.errorToThrow = new InvalidApplicationIdError();
    await TestClass.run([]);

    expect([
      'The application id is invalid!',
      '',
      'Check that you have the correct application id and try again',
    ]).wasOutput();
  });

  test('Will help with Invallid Private Key', async () =>{
    TestClass.errorToThrow = new InvalidPrivateKeyError();
    await TestClass.run([]);

    expect([
      'The private key is invalid!',
      `Check that you have the correcte private key and run this command again`,
      `Note: The private key can be a path to the file or the value of the private key`,
    ]).wasOutput();
  });

  test('Will help with Missing Private Key', async () =>{
    TestClass.errorToThrow = new MissingPrivateKeyError();
    await TestClass.run([]);

    expect([
      'You do not have the private key set!',
      `Note: The private key can be a path to the file or the value of the private key`,
      '',
      'To fix this error you can:',
      `1. Run vonage config:set private-key <value>`,
      `2. Run this command again and pass in the private key using --private-key=<value>`,
      `3. Set the VONAGE_PRIVATE_KEY environment variable`,
    ]).wasOutput();
  });
});
