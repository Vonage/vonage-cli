import { appId, privateKey } from '../../credentialFlags.js';
import { conversationIdFlag } from '../../conversations/conversationFlags.js';
import { displayFullMember } from '../../members/display.js';
import { json, yaml } from '../../commonFlags.js';
import YAML from 'yaml';
import { Client } from '@vonage/server-client';
import { makeSDKCall } from '../../utils/makeSDKCall.js';

export const command = 'show <conversation-id> <member-id>';

export const desc = 'Show a member. "me" is not supported as the CLI will automatically generate the JWT token. ';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .positional(
    'conversation-id',
    conversationIdFlag,
  )
  .positional(
    'member-id',
    {
      describe: 'Member ID',
      type: 'string',
    },
  )
  .options({
    'json': json,
    'yaml': yaml,
    'app-id': appId,
    'private-key': privateKey,
  });

export const handler = async (argv) => {
  console.info('Show member');
  const { SDK, conversationId, memberId } = argv;

  const member = await makeSDKCall(
    SDK.conversations.getMember.bind(SDK.conversations),
    'Fetching member',
    conversationId,
    memberId,
  );

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
    return;
  }

  displayFullMember(member);
};
