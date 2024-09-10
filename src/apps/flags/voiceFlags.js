const { coerceUrl } = require('../../utils/coerceUrl');
const { coerceNumber } = require('../../utils/coerceNumber');

const helpGroup = 'Voice Capabilities';

const voiceFlags = {
  'voice-signed-callbacks': {
    type: 'boolean',
    description: 'Enable signed callbacks',
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    group: helpGroup,
  },
  'voice-conversations-ttl': {
    description: 'The time-to-live for conversations (measured in seconds)',
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    coerce: coerceNumber(
      'voice-conversations-ttl',
      { min: 60, max: 86400 },
    ),
    group: helpGroup,
  },
  'voice-leg-persistence-time': {
    description: 'The persistence duration for legs (measured in days)',
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    coerce: coerceNumber(
      'voice-leg-persistence-time',
      { min: 1, max: 365 },
    ),
    group: helpGroup,
  },
  'voice-region':{
    description: 'All inbound, programmable SIP and SIP connect calls will be sent to the selected region. If the call is using a regional endpoint this will override the application setting',
    // TODO pull in region from SDK
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    choices: [
      'na-east',
      'na-west',
      'eu-east',
      'eu-west',
      'apac-sng',
      'apac-australia',
    ],
    group: helpGroup,
  },

  // answer
  'voice-answer-url':{
    description: 'Answer Webhook URL Address',
    implies: ['voice-fallback-url', 'voice-event-url'],
    group: helpGroup,
    coerce: coerceUrl('voice-answer-url'),
  },
  'voice-answer-http':{
    description: 'Answer Webhook HTTP Method',
    options: ['GET', 'POST'],
    implies: ['voice-answer-url'],
    group: helpGroup,
  },
  'voice-answer-connection-timeout':{
    description: 'Answer connection timeout',
    implies: ['voice-answer-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-answer-connection-timeout',
      { min: 300, max: 5000 },
    ),
  },
  'voice-answer-socket-timeout':{
    description: 'Answer socket timeout',
    implies: ['voice-answer-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-answer-socket-timeout',
      { min: 300, max: 5000 },
    ),
  },

  // events
  'voice-event-url':{
    description: 'Event Webhook URL Address',
    implies: ['voice-fallback-url', 'voice-answer-url'],
    group: helpGroup,
    coerce: coerceUrl('voice-event-url'),
  },
  'voice-event-http':{
    description: 'Event Webhook HTTP Method',
    options: ['GET', 'POST'],
    implies: ['voice-fallback-url', 'voice-answer-url'],
    group: helpGroup,
  },
  'voice-event-connection-timeout':{
    description: 'Event connection timeout',
    implies: ['voice-event-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-event-connection-timeout',
      { min: 300, max: 5000 },
    ),
  },
  'voice-event-socket-timeout':{
    description: 'Event socket timeout',
    implies: ['voice-event-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-event-socket-timeout',
      { min: 300, max: 5000 },
    ),
  },

  // fallbacks
  'voice-fallback-url':{
    description: 'Fallback Webhook URL Address',
    implies: ['voice-event-url', 'voice-answer-url'],
    coerce: coerceUrl('voice-fallback-url'),
    group: helpGroup,
  },
  'voice-fallback-http':{
    aliases: ['voice_fallback_http'],
    description: 'Fallback Webhook HTTP Method',
    options: ['GET', 'POST'],
    implies: ['voice-event-url', 'voice-answer-url'],
    group: helpGroup,
  },
  'voice-fallback-connection-timeout':{
    description: 'Fallback connection timeout',
    implies: ['voice-fallback-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-fallback-connection-timeout',
      { min: 300, max: 5000 },
    ),
  },
  'voice-fallback-socket-timeout':{
    description: 'Fallback socket timeout',
    implies: ['voice-fallback-url'],
    group: helpGroup,
    coerce: coerceNumber(
      'voice-fallback-socket-timeout',
      { min: 300, max: 5000 },
    ),
  },
};

exports.voiceGroup = helpGroup;
exports.voiceFlags = voiceFlags;
