const group = 'Message Capabilities';

const messageFlags = {
  'messages-inboud-url': {
    description: 'URL for inbound messages',
    type: 'string',
    group: group,
  },
  'messages-status-url': {
    description: 'URL for status messages',
    type: 'string',
    group: group,
  },
  'messages-version': {
    description: 'Version for webhook data',
    type: 'string',
    group: group,
    choices: ['v0.1', 'v1'],
  },
  'messages-enhanced-media': {
    description: 'Support for enhanced media',
    type: 'boolean',
    group: group,
  },
};

exports.messageGroup = group;
exports.messageFlags = messageFlags;
