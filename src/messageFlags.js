import { makeSDKCall } from './utils/makeSDKCall.js';

export const to = {
  describe: 'The recipient phone number',
  type: 'string',
  group: 'Message API',
};

export const from = {
  describe: 'The sender phone number or alphanumeric sender ID',
  type: 'string',
  group: 'Message API',
};

export const clientRef = {
  describe: 'A client reference to attach to the message',
  type: 'string',
  group: 'Message API',
};

export const webhookUrl = {
  describe: 'Override the status webhook URL for this message',
  type: 'string',
  group: 'Message API',
};

export const webhookVersion = {
  describe: 'Override the status webhook payload version for this message',
  choices: ['v0.1', 'v1'],
  type: 'string',
  group: 'Message API',
};

export const ttl = {
  describe: 'How long, in seconds, Vonage should attempt delivery',
  type: 'number',
  group: 'Message API',
};

export const sendMessage = async (SDK, message) => {
  const result = await makeSDKCall(
    SDK.messages.send.bind(SDK.messages),
    `Sending ${message.channel}:${message.messageType} message to ${message.to}`,
    message,
  );

  if (!result) {
    return;
  }

  console.info('Message Sent');
  console.log(result.messageUUID);
};
