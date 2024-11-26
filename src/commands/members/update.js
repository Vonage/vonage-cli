const YAML = require('yaml');
const { appId, privateKey } = require('../../credentialFlags');
const { conversationIdFlag } = require('../../conversations/conversationFlags');
const { loadMemberFromSDK } = require('../../members/loadMemberFromSdk');
const { loadConversationFromSDK } = require('../../conversations/loadConversationFromSdk');
const { spinner } = require('../../ux/spinner');
const { sdkError } = require('../../utils/sdkError');
const { yaml, json, force } = require('../../commonFlags');
const { displayFullMember } = require('../../members/display');
const { Client } = require('@vonage/server-client');

exports.command = 'update <conversation-id> <member-id>';

exports.desc = 'Update a member';

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
    'state:': {
      describe: 'Member state',
      type: 'string',
      choices: ['joined', 'invited'],
      group: 'Member',
    },
    'from': {
      describe: 'The user ID of the member that is causing this update.',
      type: 'string',
      group: 'Member Channel',
    },
    'reason-code': {
      describe: 'The reason code for the update',
      type: 'string',
      group: 'Member',
    },
    'reason-text': {
      describe: 'The reason text for the update',
      type: 'string',
      group: 'Member',
    },
    'yaml': yaml,
    'json': json,
    'force': force,
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  console.info('Update member');
  const { SDK, conversationId, memberId } = argv;

  await loadConversationFromSDK(SDK, conversationId);
  await loadMemberFromSDK(SDK, conversationId, memberId);

  let updatedMember;

  const { stop, fail } = spinner({
    message: 'Updating member',
  });

  try {
    updatedMember = await SDK.conversations.updateMember(
      conversationId,
      memberId,
      JSON.parse(JSON.stringify({
        state: argv.state,
        from: argv.from,
        reason: {
          code: argv.reasonCode,
          text: argv.reasonText,
        },
      })),
    );
    stop();
  } catch (error) {
    fail();
    sdkError(error);
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(updatedMember, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(updatedMember, true),
      null,
      2,
    ));
    return;
  }

  console.log('');
  console.log('');
  displayFullMember(updatedMember);
};
