import YAML from 'yaml';
import { appId, privateKey } from '../../credentialFlags.js';
import { yaml, json } from '../../commonFlags.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { displayFullUser } from '../../users/display.js';

export const command = 'show <id>';

export const desc = 'Show user';

/* istanbul ignore next */
export const builder = (yargs) => yargs
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

export const handler = async (argv) => {
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
