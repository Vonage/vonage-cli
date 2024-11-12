const { spinner } = require('../../ux/spinner');
const merge = require('deepmerge');
const { conversationFlags, validateEvents } = require('./create');
const { appId, privateKey } = require('../../credentialFlags');
const { force } = require('../../commonFlags');
const { sdkError } = require('../../utils/sdkError');
const { displayConversation } = require('../../conversations/display');
const { loadConversationFromSDK } = require('../../conversations/loadConversationFromSDK');
const { unsetRemove, coerceRemove, coerceRemoveCallback } = require('../../utils/coerceRemove');
const yargs = require('yargs');

exports.command = 'update <id>';

exports.desc = 'Update conversation';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The id of the conversation to update',
    },
  )
  .options({
    ...conversationFlags,
    'display-name': {
      ...conversationFlags['display-name'],
      coerce: coerceRemove,
    },
    'image-url': {
      ...conversationFlags['image-url'],
      coerce: coerceRemoveCallback(conversationFlags['image-url'].coerce),
    },
    'ttl': {
      ...conversationFlags['ttl'],
      coerce: coerceRemove,
    },
    'custom-data': {
      ...conversationFlags['custom-data'],
      coerce: coerceRemoveCallback(conversationFlags['custom-data'].coerce),
    },
    'callback-url': {
      ...conversationFlags['callback-url'],
      coerce: coerceRemoveCallback(conversationFlags['callback-url'].coerce),
    },
    'callback-event-mask': {
      ...conversationFlags['callback-event-mask'],
      coerce: coerceRemove,
    },
    'callback-application-id': {
      ...conversationFlags['callback-application-id'],
      coerce: coerceRemove,
    },
    'callback-ncco-url': {
      ...conversationFlags['callback-ncco-url'],
      coerce: coerceRemoveCallback(conversationFlags['callback-ncco-url'].coerce),
    },
    'app-id': appId,
    'private-key': privateKey,
    'force': force,
  });


exports.handler = async (argv) => {
  console.info('Creating conversation');
  const { SDK, callbackEventMask } = argv;

  if (!await validateEvents(callbackEventMask)) {
    console.log('Aborting');
    yargs.exit(1);
    return;
  }

  const conversation = unsetRemove(
    merge(
      await loadConversationFromSDK(SDK, argv.id),
      {
        name: argv.name,
        displayName: argv.displayName,
        imageUrl: argv.imageUrl,
        properties: {
          ttl: argv.ttl,
          customData: argv.customData,
        },
        callback: {
          url: argv.callbackUrl,
          method: argv.callbackMethod,
          eventMask: callbackEventMask ? callbackEventMask.join(',') : undefined,
          params: {
            applicationId: argv.callbackApplicationId,
            nccoUrl: argv.callbackNccoUrl,
          },
        },
      },
    ),
    true,
  );

  const { stop, fail } = spinner({
    message: 'Updateing conversation',
  });

  let updatedConversation;
  try {
    console.debug('Updating conversation', conversation);
    updatedConversation = await SDK.conversations.updateConversation(conversation);
    console.debug('Conversation updated', updatedConversation);
    stop();
  } catch (error) {
    fail();
    sdkError(error);
    return;
  }

  console.log('');
  displayConversation(updatedConversation);
};
