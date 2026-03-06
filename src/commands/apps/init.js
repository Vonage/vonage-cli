import chalk from 'chalk';
import { Client } from '@vonage/server-client';
import { prompt } from '../../ux/prompts.js';
import { displayApplication } from '../../apps/display.js';
import { confirm } from '../../ux/confirm.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { json, yaml, force } from '../../commonFlags.js';
import { promptApplicationCapabilities } from '../../apps/prompts/capabilities.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { writeFile, writeJSONFile } from '../../utils/fs.js';
import { overwriteWithNewLine } from '../../ux/clear.js';
import { EOL } from 'os';
import YAML from 'yaml';

export const command = 'init';

export const desc = 'Interactivly create a new application';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'force': force,
    'json': json,
    'yaml': yaml,
  });

export const handler = async (argv) => {
  console.info('Interactivly creating application');
  process.stderr.write(chalk.underline('Create a new application'));
  const { SDK } = argv;

  const appData = {
    name: undefined,
    privacy: {
      improveAi: false,
    },
    capabilities: {},
  };

  appData.name = await prompt(
    'Enter the name of the application:',
    { required: true },
  );

  appData.privacy.improveAi = await confirm(
    'Do you want to allow Vonage to use this application for AI training [y/n]?',
    { defaultResponse: false },
  );

  // TODO: Allow importing existing keys

  process.stderr.write(EOL);
  process.stderr.write(chalk.underline('Application Capabilities'));
  appData.capabilities = await promptApplicationCapabilities();

  console.info('Creating application');
  console.debug('New Application', appData);
  const newApplication = await makeSDKCall(
    SDK.applications.createApplication.bind(SDK.applications),
    'Creating Application',
    appData,
  );

  try {
    process.stderr.write(EOL);
    process.stderr.write('Saving private key ...');
    await writeFile(`${argv.config.localConfigPath}/private.key`, newApplication.keys.privateKey);
    overwriteWithNewLine('Saving private key ... Done!');
    process.stderr.write(EOL);
  } catch (error) {
    console.debug(error.name);
    switch (error.name) {
    case 'UserDeclinedError':
      overwriteWithNewLine('Saving private key ... User declined');
      break;
    default:
      overwriteWithNewLine('Saving private key ... Failed');
      console.error('Error saving private key:', error);
    }
  }

  console.info('Creating local config file');

  const newAuthInformation = {
    ...argv.config.global,
    'appId': newApplication.id,
    'privateKey': newApplication.keys.privateKey,
  };

  console.debug('New Config', newAuthInformation);

  try {
    console.info('Saiving local config');
    process.stderr.write('Saiving local config ...');
    await writeJSONFile(
      argv.config.localConfigFile,
      newAuthInformation,
      `Configuration file ${argv.config.localConfigFile} already exists. Overwrite?`,
    );

    overwriteWithNewLine('Saving local config ... Done!');
    console.info('Config file saved');
  } catch (error) {
    console.error('Failed to save new configuration', error);
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true),
    ));
    return;
  }

  process.stderr.write(EOL);
  console.log('Application created');
  displayApplication(newApplication);
};


