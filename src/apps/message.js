const { coerceUrl } = require('../utils/coerceUrl');
const { coerceRemoveCallback } = require('../utils/coerceRemove');

const updateMessages = (app, flags) => {
  const newMessages = {
    webhooks: {
      inboundUrl: {
        address: app.capabilities?.messages?.webhooks?.inboundUrl?.address,
        httpMethod: app.capabilities?.messages?.webhooks?.inboundUrl?.httpMethod,
      },
      statusUrl: {
        address: app.capabilities?.messages?.webhooks?.statusUrl?.address,
        httpMethod: app.capabilities?.messages?.webhooks?.statusUrl?.httpMethod,
      },
    },
    version: app.capabilities?.messages?.version,
    authenticateInboundMedia: app.capabilities?.messages?.authenticateInboundMedia,
  };

  addInboundUrl(newMessages, flags);
  addStatusUrl(newMessages, flags);

  if (flags.messagesVersion) {
    newMessages.version = flags.messagesVersion;
  }

  if (flags.authenticateInboundMedia === undefined) {
    newMessages.authenticateInboundMedia = flags.messagesAuthenticateMedia;
  }

  app.capabilities.messages = JSON.parse(JSON.stringify(newMessages));

  if (Object.keys(app.capabilities.messages).length < 1) {
    app.capabilities.messages = undefined;
    return;
  }

  if (Object.keys(app.capabilities.messages.webhooks).length < 1) {
    app.capabilities.messages.webhooks = undefined;
  }

  if (app.capabilities.messages.webhooks === undefined) {
    app.capabilities.messages = undefined;
  }
};

const addInboundUrl = (capability, flags) => {
  if (flags.messagesInboundUrl === '__REMOVE__') {
    capability.webhooks.inboundUrl = undefined;
    return;
  }

  const newInboundUrl = capability.webhooks?.inboundUrl;

  if (flags.messagesInboundUrl && flags.messagesInboundUrl !== '__REMOVE__') {
    newInboundUrl.address = flags.messagesInboundUrl;
    newInboundUrl.httpMethod = 'POST';
  }

  capability.webhooks.inboundUrl = JSON.parse(JSON.stringify(newInboundUrl));

  if (Object.keys(capability.webhooks.inboundUrl).length < 1) {
    capability.webhooks.inboundUrl = undefined;
  }
};

const addStatusUrl = (capability, flags) => {
  if (flags.messagesStatusUrl === '__REMOVE__') {
    capability.webhooks.statusUrl = undefined;
    return;
  }

  const newStatusUrl = capability.webhooks?.statusUrl;

  if (flags.messagesStatusUrl && flags.messagesStatusUrl !== '__REMOVE__') {
    newStatusUrl.address = flags.messagesStatusUrl;
    newStatusUrl.httpMethod = 'POST';
  }

  capability.webhooks.statusUrl = JSON.parse(JSON.stringify(newStatusUrl));

  if (Object.keys(capability.webhooks.statusUrl).length < 1) {
    capability.webhooks.statusUrl = undefined;
  }
};

const group = 'Message Capabilities';

const messageFlags = {
  'messages-inbound-url': {
    description: 'URL for inbound messages',
    type: 'string',
    group: group,
    implies: ['messages-status-url'],
    coerce: coerceRemoveCallback(coerceUrl('messages-inbound-url')),
  },
  'messages-status-url': {
    description: 'URL for status messages',
    type: 'string',
    group: group,
    implies: ['messages-inbound-url'],
    coerce: coerceRemoveCallback(coerceUrl('messages-status-url')),
  },
  'messages-version': {
    description: 'Version for webhook data',
    type: 'string',
    group: group,
    choices: ['v0.1', 'v1'],
    implies: ['messages-inbound-url', 'messages-status-url'],
  },
  'messages-authenticate-media': {
    description: 'Authenticate inbound media',
    type: 'boolean',
    group: group,
  },
};

exports.messageGroup = group;

exports.messageFlags = messageFlags;

exports.updateMessages = updateMessages;
