const yargs = require('yargs');
const { dumpCommand } = require('../ux/dump');

exports.sdkError = async (error) => {
  const statusCode = error.response?.status;
  const errorName = error.constructor.name;
  let errorData = {};
  try {
    errorData = await error.response?.json();
  } catch (error) {
    console.debug('Failed to parse error response', error);
  }

  console.debug(`API Error data: ${JSON.stringify(errorData, null, 2)}`);
  console.debug(`Status Code ${statusCode}`);
  console.debug(`Error name: ${errorName}`);

  switch (statusCode || errorName) {
  case 401:
  case 403:
    console.error('You are not authorized to perform this action');
    console.log('');
    console.log(`Please check your credentials by running ${dumpCommand('vonage auth show')} and try again`);
    yargs.exit(5);
    return;
  case 404:
    console.error(
      `Resource not Found${errorData.detail
        ? `: ${errorData.detail}`
        : ''}`,
    );
    yargs.exit(20);
    return;

  case 'MissingApplicationIdError':
  case 'MissingPrivateKeyError':
    console.error('This command needs to be run against an application.');
    console.log('');
    console.log('You can fix this problem by:');
    console.log('');
    console.log(`1. Running this command again with the ${dumpCommand('--app-id')} and the ${dumpCommand('--private-key')} arguments passed in`);
    console.log(`2. Configure the CLI globally using the ${dumpCommand('vonage auth set')} command`);
    console.log(`3. Configure the CLI locally using the ${dumpCommand('vonage auth set')} command with the ${dumpCommand('--local')} flag`);
    yargs.exit(2);
    return;

  // This condition should be very hard to reach but is possible.
  // 1. The configuration file has been altered to remove the properties.
  // 2. The user is using environment variables that have been blanked out
  // Just some of of the ways I think this can be reached
  case 'MissingApiKeyError':
  case 'MissingApiSecretError':
    console.error('This command needs your API Key and Secret');
    console.log('');
    console.log('You can fix this problem by:');
    console.log('');
    console.log(`1. Running this command again with the ${dumpCommand('--api-key')} and the ${dumpCommand('--api-secret')} arguments passed in`);
    console.log(`2. Configure the CLI globally using the ${dumpCommand('vonage auth set')} command`);
    console.log(`3. Configure the CLI locally using the ${dumpCommand('vonage auth set')} command with the ${dumpCommand('--local')} flag`);
    yargs.exit(2);
    return;


  default:
    console.error(`Error with SDK call: ${error.message}` );
    yargs.exit(99);
    return;
  }
};
