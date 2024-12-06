const YAML = require('yaml');
const { appId, privateKey } = require('../../credentialFlags');
const { conversationIdFlag } = require('../../conversations/conversationFlags');
const { yaml, json, force } = require('../../commonFlags');
const { displayFullMember } = require('../../members/display');
const { Client } = require('@vonage/server-client');
const { makeSDKCall } = require('../../utils/makeSDKCall');

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

  await makeSDKCall(
    SDK.conversations.getMember.bind(SDK.conversations),
    'Fetching member',
    conversationId,
    memberId,
  );

  const updatedMember = await makeSDKCall(
    SDK.conversations.updateMember.bind(SDK.conversations),
    'Updating member',
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

  console.debug('Updated member', updatedMember);

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
