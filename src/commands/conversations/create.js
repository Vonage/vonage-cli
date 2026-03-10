import { confirm } from '../../ux/confirm.js';
import { suggest } from '@laboralphy/did-you-mean';
import { EventType } from '@vonage/conversations';
import { appId, privateKey } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { displayConversation } from '../../conversations/display.js';
import { coerceUrl } from '../../utils/coerceUrl.js';
import { coerceJSON } from '../../utils/coerceJSON.js';
import yargs from 'yargs';
import { makeSDKCall } from '../../utils/makeSDKCall.js';

const y = yargs();

const conversationEvents = Object.values(EventType);

const conversationFlags = {
  'name': {
    type: 'string',
    describe: 'Your internal conversation name. Must be unique. If not supplied a randomly generated name will be used.',
    group: 'Conversation',
  },
  'display-name': {
    type: 'string',
    describe: 'The public facing name of the conversation',
    group: 'Conversation',
  },
  'image-url': {
    type: 'string',
    describe: 'A URL to an image to associate with the conversation',
    group: 'Conversation',
    coerce: coerceUrl('image-url'),
  },
  'ttl': {
    type: 'number',
    describe: 'Time to leave. After how many seconds an empty conversation is deleted.',
    group: 'Conversation',
  },
  'phone-number': {
    type: 'string',
    describe: 'The phone number to associate with the conversation',
    group: 'Conversation',
  },
  'custom-data': {
    type: 'string',
    describe: 'Custom data (as JSON) to associate with the conversation',
    group: 'Conversation',
    coerce: coerceJSON('custom-data'),
  },
  'callback-url': {
    type: 'string',
    describe: 'The URL to send conversation events to.',
    group: 'Conversation Callback',
    coerce: coerceUrl('callback-url'),
  },
  'callback-event-mask': {
    type: 'string',
    describe: 'A list of strin detailing the events to send to the callback URL. If not supplied all events will be sent.',
    array: true,
    group: 'Conversation Callback',
  },
  'callback-method': {
    type: 'string',
    describe: 'The HTTP method to use when sending events to the callback URL.',
    group: 'Conversation Callback',
  },
  'callback-application-id': {
    type: 'string',
    describe: 'The application ID that the event is associated with.',
    group: 'Conversation Callback',
  },
  'callback-ncco-url': {
    type: 'string',
    describe: 'The URL to send the NCCO to.',
    group: 'Conversation Callback',
    coerce: coerceUrl('callback-ncco-url'),
  },
};

const suggestEvent = (userEvents) => userEvents.forEach((event) => {
  if (conversationEvents.includes(event)) {
    return;
  }

  console.warn(`Invalid event mask: ${event}`);
  const suggestions = suggest(event, conversationEvents, { count: 1 });
  if (suggestions.length > 0) {
    console.warn(`Did you mean: ${suggestions.join(', ')}?`);
  }
});

const validateEvents = async (callbackEventMask) => {
  if (
    callbackEventMask
    && !callbackEventMask.every((event) => conversationEvents.includes(event))
  ) {
    console.debug(conversationEvents);
    suggestEvent(callbackEventMask);
    console.log('');
    return await confirm(`Do you want to continue with ${callbackEventMask.length > 1 ? 'these masks' : 'this mask'}?`);
  }
  return true;
};

export { validateEvents };

export { conversationFlags };

export const command = 'create';

export const desc = 'Create a conversation';

export const builder = (yargs) => yargs
  .options({
    ...conversationFlags,
    'app-id': appId,
    'private-key': privateKey,
    'force': force,
  });

export const handler = async (argv) => {
  console.info('Creating conversation');
  const { SDK, callbackEventMask } = argv;

  if (!await validateEvents(callbackEventMask)) {
    console.log('Aborting');
    y.exit(1);
    return;
  }

  const conversation = {
    name: argv.name,
    displayName: argv.displayName,
    imageUrl: argv.imageUrl,
    properties: {
      ttl: argv.ttl,
      customData: argv.customData,
    },
    numbers: argv.phoneNumber
      ? [
        {
          type: 'phone',
          number: argv.phoneNumber,
        },
      ]
      : undefined,
    callback: {
      url: argv.callbackUrl,
      method: argv.callbackMethod,
      eventMask: callbackEventMask ? callbackEventMask.join(',') : undefined,
      params: {
        applicationId: argv.callbackApplicationId,
        nccoUrl: argv.callbackNccoUrl,
      },
    },
  };

  console.debug('Creating conversation', conversation);
  const createdConversation = await makeSDKCall(
    SDK.conversations.createConversation.bind(SDK.conversations),
    'Creating conversation',
    conversation,
  );
  console.debug('Conversation created', createdConversation);

  console.log('');
  displayConversation(createdConversation);
};
