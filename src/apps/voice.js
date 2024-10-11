const { coerceUrl } = require('../utils/coerceUrl');
const { coerceNumber } = require('../utils/coerceNumber');
const { coerceRemoveCallback, coerceRemoveList } = require('../utils/coerceRemove');

const updateVoice = async (app, flags) => {
  const newVoice = {
    webhooks: {
      eventUrl: {
        address: app.capabilities?.voice?.webhooks?.eventUrl?.address,
        httpMethod: app.capabilities?.voice?.webhooks?.eventUrl?.httpMethod,
        socketTimeout: app.capabilities?.voice?.webhooks?.eventUrl?.socketTimeout,
        connectTimeout: app.capabilities?.voice?.webhooks?.eventUrl?.connectTimeout,
      },
      answerUrl: {
        address: app.capabilities?.voice?.webhooks?.answerUrl?.address,
        httpMethod: app.capabilities?.voice?.webhooks?.answerUrl?.httpMethod,
        socketTimeout: app.capabilities?.voice?.webhooks?.answerUrl?.socketTimeout,
        connectTimeout: app.capabilities?.voice?.webhooks?.answerUrl?.connectTimeout,
      },
      fallbackAnswerUrl: {
        address: app.capabilities?.voice?.webhooks?.fallbackAnswerUrl?.address,
        httpMethod: app.capabilities?.voice?.webhooks?.fallbackAnswerUrl?.httpMethod,
        socketTimeout: app.capabilities?.voice?.webhooks?.fallbackAnswerUrl?.socketTimeout,
        connectTimeout: app.capabilities?.voice?.webhooks?.fallbackAnswerUrl?.connectTimeout,
      },
    },
    signedCallbacks: app.capabilities?.voice?.signedCallbacks,
    conversationsTtl: app.capabilities?.voice?.conversationsTtl,
    legPersistenceTime: app.capabilities?.voice?.legPersistenceTime,
    region: app.capabilities?.voice?.region,
  };

  addEventUrl(newVoice, flags);
  addAnswerUrl(newVoice, flags);
  addFallbackAnswerUrl(newVoice, flags);

  if (flags.voiceSignedCallbacks !== undefined) {
    newVoice.signedCallbacks = flags.voiceSignedCallbacks;
  }

  if (flags.voiceConversationsTtl !== undefined) {
    newVoice.conversationsTtl = flags.voiceConversationsTtl;
  }

  if (flags.voiceLegPersistenceTime !== undefined) {
    newVoice.legPersistenceTime = flags.voiceLegPersistenceTime;
  }

  if (flags.voiceRegion) {
    newVoice.region = flags.voiceRegion;
  }

  // Remove undefined values
  app.capabilities.voice = JSON.parse(JSON.stringify(newVoice));

  console.debug('Updated voice capabilities', app.capabilities.voice);
};

const addAnswerUrl = (capability, flags) => {
  const newAnswerUrl = capability.webhooks?.answerUrl;

  if (flags.voiceAnswerUrl) {
    newAnswerUrl.address = flags.voiceAnswerUrl;
    newAnswerUrl.httpMethod = capability.webhooks?.answerUrl?.httpMethod || 'POST';
  }

  if (flags.voiceAnswerHttp) {
    newAnswerUrl.httpMethod = flags.voiceAnswerHttp;
  }

  if (flags.voiceAnswerConnectionTimeout) {
    newAnswerUrl.connectTimeout = flags.voiceAnswerConnectionTimeout;
  }

  if (flags.voiceAnswerSocketTimeout) {
    newAnswerUrl.socketTimeout = flags.voiceAnswerSocketTimeout;
  }

  capability.webhooks.answerUrl = JSON.parse(JSON.stringify(newAnswerUrl));

  if (Object.keys(capability.webhooks.answerUrl).length < 1) {
    capability.webhooks.answerUrl = undefined;
  }
};

const addEventUrl = (capability, flags) => {
  const newEventUrl = capability.webhooks?.eventUrl;

  if (flags.voiceEventUrl) {
    newEventUrl.address = flags.voiceEventUrl;
    newEventUrl.httpMethod = capability.webhooks?.eventUrl?.httpMethod || 'POST';
  }

  if (flags.voiceEventHttp) {
    newEventUrl.httpMethod = flags.voiceEventHttp;
  }

  if (flags.voiceEventConnectionTimeout) {
    newEventUrl.connectTimeout = flags.voiceEventConnectionTimeout;
  }

  if (flags.voiceEventSocketTimeout) {
    newEventUrl.socketTimeout = flags.voiceEventSocketTimeout;
  }

  capability.webhooks.eventUrl = JSON.parse(JSON.stringify(newEventUrl));

  if (Object.keys(capability.webhooks.eventUrl).length < 1) {
    capability.webhooks.eventUrl = undefined;
  }
};

const addFallbackAnswerUrl = (capability, flags) => {
  const newFallbackAnswerUrl = capability.webhooks?.fallbackAnswerUrl;

  if (flags.voiceFallbackUrl) {
    newFallbackAnswerUrl.address = flags.voiceFallbackUrl;
    newFallbackAnswerUrl.httpMethod = capability.webhooks?.eventUrl?.httpMethod || 'POST';
  }

  if (flags.voiceFallbackHttp) {
    newFallbackAnswerUrl.httpMethod = flags.voiceFallbackHttp;
  }

  if (flags.voiceFallbackConnectionTimeout) {
    newFallbackAnswerUrl.connectTimeout = flags.voiceFallbackConnectionTimeout;
  }

  if (flags.voiceFallbackSocketTimeout) {
    newFallbackAnswerUrl.socketTimeout = flags.voiceFallbackSocketTimeout;
  }

  capability.webhooks.fallbackAnswerUrl = JSON.parse(JSON.stringify(newFallbackAnswerUrl));

  if (Object.keys(capability.webhooks.fallbackAnswerUrl).length < 1) {
    capability.webhooks.fallbackAnswerUrl = undefined;
  }
};

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
    corece: coerceRemoveCallback(
      coerceNumber('voice-conversations-ttl', { min: 60, max: 86400 }),
    ),
    group: helpGroup,
  },
  'voice-leg-persistence-time': {
    description: 'The persistence duration for legs (measured in days)',
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    corece: coerceRemoveCallback(
      coerceNumber('voice-leg-persistence-time', { min: 1, max: 365 }),
    ),
    group: helpGroup,
  },
  'voice-region':{
    description: 'All inbound, programmable SIP and SIP connect calls will be sent to the selected region. If the call is using a regional endpoint this will override the application setting',
    // TODO pull in region from SDK
    implies: ['voice-fallback-url', 'voice-event-url', 'voice-answer-url'],
    corece: coerceRemoveList(
      'voice-region',
      [
        'na-east',
        'na-west',
        'eu-east',
        'eu-west',
        'apac-sng',
        'apac-australia',
      ],
    ),
    group: helpGroup,
  },

  // answer
  'voice-answer-url':{
    description: 'Answer Webhook URL Address',
    implies: ['voice-fallback-url', 'voice-event-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(coerceUrl('voice-answer-url')),
  },
  'voice-answer-http':{
    description: 'Answer Webhook HTTP Method',
    implies: ['voice-answer-url'],
    coerce: coerceRemoveList('voice-answer-http', ['GET', 'POST']),
    group: helpGroup,
  },
  'voice-answer-connection-timeout':{
    description: 'Answer connection timeout',
    implies: ['voice-answer-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-answer-connection-timeout', { min: 300, max: 5000 }),
    ),
  },
  'voice-answer-socket-timeout':{
    description: 'Answer socket timeout',
    implies: ['voice-answer-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-answer-socket-timeout', { min: 300, max: 5000 }),
    ),
  },

  // events
  'voice-event-url':{
    description: 'Event Webhook URL Address',
    implies: ['voice-fallback-url', 'voice-answer-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(coerceUrl('voice-event-url')),
  },
  'voice-event-http':{
    description: 'Event Webhook HTTP Method',
    coerce: coerceRemoveList('voice-answer-http', ['GET', 'POST']),
    implies: ['voice-fallback-url', 'voice-answer-url'],
    group: helpGroup,
  },
  'voice-event-connection-timeout':{
    description: 'Event connection timeout',
    implies: ['voice-event-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-event-connection-timeout', { min: 300, max: 5000 }),
    ),
  },
  'voice-event-socket-timeout':{
    description: 'Event socket timeout',
    implies: ['voice-event-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-event-socket-timeout', { min: 300, max: 5000 }),
    ),
  },

  // fallbacks
  'voice-fallback-url':{
    description: 'Fallback Webhook URL Address',
    implies: ['voice-event-url', 'voice-answer-url'],
    coerce: coerceRemoveCallback(coerceUrl('voice-fallback-url')),
    group: helpGroup,
  },
  'voice-fallback-http':{
    aliases: ['voice_fallback_http'],
    description: 'Fallback Webhook HTTP Method',
    coerce: coerceRemoveList('voice-answer-http', ['GET', 'POST']),
    implies: ['voice-event-url', 'voice-answer-url'],
    group: helpGroup,
  },
  'voice-fallback-connection-timeout':{
    description: 'Fallback connection timeout',
    implies: ['voice-fallback-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-fallback-connection-timeout', { min: 300, max: 5000 }),
    ),
  },
  'voice-fallback-socket-timeout':{
    description: 'Fallback socket timeout',
    implies: ['voice-fallback-url'],
    group: helpGroup,
    coerce: coerceRemoveCallback(
      coerceNumber('voice-fallback-socket-timeout', { min: 300, max: 5000 }),
    ),
  },
};

exports.voiceGroup = helpGroup;

exports.voiceFlags = voiceFlags;

exports.updateVoice = updateVoice;
