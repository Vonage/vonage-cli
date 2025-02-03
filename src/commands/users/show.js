const YAML = require('yaml');
const { appId, privateKey } = require('../../credentialFlags');
const { yaml, json } = require('../../commonFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { displayFullUser } = require('../../users/display');

exports.command = 'show <id>';

exports.desc = 'Show user';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The user ID',
    })
  .options({
    'app-id': appId,
    'private-key': privateKey,
    'json': json,
    'yaml': yaml,
  });

exports.handler = async (argv) => {
  const { SDK, id } = argv;
  console.info('Showing user details');

  const user = await makeSDKCall(
    SDK.users.getUser.bind(SDK.users),
    'Fetching User',
    id,
  );

  if (argv.json) {
    console.log(JSON.stringify(user, null, 2));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(user));
    return;
  }

  console.log('');
  displayFullUser(user);
};
