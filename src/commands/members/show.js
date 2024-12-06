const { appId, privateKey } = require('../../credentialFlags');
const { conversationIdFlag } = require('../../conversations/conversationFlags');
const { displayFullMember } = require('../../members/display');
const { json, yaml } = require('../../commonFlags');
const YAML = require('yaml');
const { Client } = require('@vonage/server-client');
const { makeSDKCall } = require('../../utils/makeSDKCall');

exports.command = 'show <conversation-id> <member-id>';

exports.desc = 'Show a member. "me" is not supported as the CLI will automatically generate the JWT token. ';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
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

exports.handler = async (argv) => {
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
