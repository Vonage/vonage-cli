import merge from 'deepmerge';
import { conversationFlags, validateEvents } from './create.js';
import { appId, privateKey } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { displayConversation } from '../../conversations/display.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import yargs from 'yargs';

export const command = 'update <id>';

export const desc = 'Update conversation';

/* istanbul ignore next */
export const builder = (yargs) => yargs
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
    },
    'image-url': {
      ...conversationFlags['image-url'],
      coerce: conversationFlags['image-url'].coerce,
    },
    'ttl': {
      ...conversationFlags['ttl'],
    },
    'custom-data': {
      ...conversationFlags['custom-data'],
      coerce: conversationFlags['custom-data'].coerce,
    },
    'callback-url': {
      ...conversationFlags['callback-url'],
      coerce: conversationFlags['callback-url'].coerce,
    },
    'callback-event-mask': {
      ...conversationFlags['callback-event-mask'],
    },
    'callback-application-id': {
      ...conversationFlags['callback-application-id'],
    },
    'callback-ncco-url': {
      ...conversationFlags['callback-ncco-url'],
      coerce: conversationFlags['callback-ncco-url'].coerce,
    },
    'app-id': appId,
    'private-key': privateKey,
    'force': force,
  });

const updateCallback = ({
  callbackEventMask,
  callbackUrl,
  callbackMethod,
  ...rest
}) => {
  const callback = JSON.parse(JSON.stringify({
    eventMask: callbackEventMask?.join(','),
    method: callbackMethod,
    url: callbackUrl,
    params: updateParams(rest),
  }));

  return Object.keys(callback).length > 0 ? callback : undefined ;
};

const updateParams = ({
  callbackApplicationId,
  callbackNccoUrl,
}) => {
  const params = JSON.parse(JSON.stringify({
    applicationId: callbackApplicationId,
    nccoUrl: callbackNccoUrl,
  }));

  return Object.keys(params).length > 0 ? params : undefined ;
};

export const handler = async (argv) => {
  console.info('Updating conversation');
  const { SDK, callbackEventMask } = argv;

  if (!await validateEvents(callbackEventMask)) {
    console.log('Aborting');
    yargs.exit(1);
    return;
  }
  const conversation = await makeSDKCall(
    SDK.conversations.getConversation.bind(SDK.conversations),
    'Fetching conversation',
    argv.id,
  );

  const conversationToUpdate = {
    id: conversation.id,
    displayName: argv.displayName || conversation.displayName,
    name: argv.name || conversation.name,
    imageUrl: argv.imageUrl || conversation.imageUrl,
    properties: merge(conversation.properties, {
      ttl: argv.ttl || conversation.properties?.ttl,
      customData: argv.customData || conversation.properties?.customData,
    }),
    callback: updateCallback(argv),
  };

  console.debug('Updated conversation', conversationToUpdate);
  const updatedConversation = makeSDKCall(
    SDK.conversations.updateConversation.bind(SDK.conversations),
    'Updating conversation',
    conversationToUpdate,
  );

  console.log('');
  displayConversation({
    ...conversation,
    ...updatedConversation,
  });
};
