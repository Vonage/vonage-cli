const { coerceUrl } = require('../utils/coerceUrl');
const { coerceRemoveCallback, coerceRemove } = require('../utils/coerceRemove');

const videoWebhooks = [
  'archiveStatus',
  'broadcastStatus',
  'captionsStatus',
  'connectionCreated',
  'connectionDestroyed',
  'renderStatus',
  'sipCallCreated',
  'sipCallDestroyed',
  'sipCallMuteForced',
  'sipCallUpdated',
  'streamCreated',
  'streamDestroyed',
];

const updateVideo = (app, flags) => {
  console.log('Updating Video capabilities', app.capabilities.video);
  console.log('Flags', flags);
  const newVideo = {
    webhooks: {
      ...videoWebhooks.reduce(
        (acc, webhook) => Object.assign(acc, { 
          [webhook]: {
            address: app.capabilities?.video?.webhooks?.[webhook]?.address,
            secret: app.capabilities?.video?.webhooks?.[webhook]?.secret,
            active: app.capabilities?.video?.webhooks?.[webhook]?.active,
          }, 
        }),
        {},
      ),
    },
    storage: app.capabilities?.video?.storage,
    environmentEnabled: app.capabilities?.video?.environmentEnabled,
    environmentId: app.capabilities?.video?.environmentId,
    hoolockConfigs: app.capabilities?.video?.hoolockConfigs,
  };

  videoWebhooks.forEach((url) => {
    updateWebhookUrl(newVideo, url, flags);
  });

  // Remove undefined values
  app.capabilities.video = JSON.parse(JSON.stringify(newVideo));

  if (Object.keys(app.capabilities.video).length < 1) {
    app.capabilities.video = undefined;
  }

  console.log('Updated Video capabilities', app.capabilities.video);
};

const updateWebhookUrl = (capability, which, flags) => {
  const newStatus = capability.webhooks?.[which];
  const urlFlag = `video${which[0].toUpperCase() + which.slice(1)}Url`;
  const secretFlag = `video${which[0].toUpperCase() + which.slice(1)}Secret`;

  if (flags[urlFlag]) {
    newStatus.address = flags[urlFlag];
    newStatus.active = true;
  }

  if (flags[secretFlag]) {
    newStatus.secret = flags[secretFlag];
  }

  capability.webhooks[which] = JSON.parse(JSON.stringify(newStatus));

  if (Object.keys(capability.webhooks[which]).length < 1) {
    capability.webhooks[which] = undefined;
  }
};

const group = 'Video Capabilities';

const videoFlags = {
  'video-archive-status-url': {
    description: 'URL for Archive',
    coerce: coerceRemoveCallback(coerceUrl('video-archive-status-url')),
    group: group,
  },
  'video-archive-status-secret': {
    description: 'Secret for Archive URL',
    group: group,
    coerce: coerceRemove,
    implies: ['video-archive-status-url'],
  },
  'video-broadcast-status-url': {
    description: 'Broadcast status URL',
    coerce: coerceRemoveCallback(coerceUrl('video-broadcast-status-url')),
    group: group,
  },
  'video-broadcast-status-secret': {
    description: 'Secret for Broadcast URL',
    coerce: coerceRemove,
    group: group,
    implies: ['video-broadcast-status-url'],
  },
  'video-captions-status-url': {
    description: 'URL for caption status',
    coerce: coerceRemoveCallback(coerceUrl('video-captions-status-url')),
    group: group,
  },
  'video-captions-status-secret': {
    description: 'Secret for Caption Status',
    group: group,
    coerce: coerceRemove,
    implies: ['video-captions-status-url'],
  },
  'video-connection-created-url': {
    description: 'URL for created connections',
    coerce: coerceRemoveCallback(coerceUrl('video-connection-created-url')),
    group: group,
  },
  'video-connection-created-secret': {
    description: 'Secret for created connection URL',
    group: group,
    coerce: coerceRemove,
    implies: ['video-connection-created-url'],
  },
  'video-connection-destroyed-url': {
    description: 'URL for destroyed connections',
    coerce: coerceRemoveCallback(coerceUrl('video-connection-destroyed-url')),
    group: group,
  },
  'video-connection-destroyed-secret': {
    description: 'Secret for destroyed connections',
    group: group,
    coerce: coerceRemove,
    implies: ['video-connection-destroyed-url'],
  },
  'video-render-status-url': {
    description: 'URL for render status ',
    coerce: coerceRemoveCallback(coerceUrl('video-render-status-url')),
    group: group,
  },
  'video-render-status-secret': {
    description: 'Secret for render status ',
    group: group,
    coerce: coerceRemove,
    implies: ['video-render-status-url'],
  },
  'video-sip-call-created-url': {
    description: 'URL for SIP created calls',
    coerce: coerceRemoveCallback(coerceUrl('video-sip-call-created-url')),
    group: group,
  },
  'video-sip-call-created-secret': {
    description: 'Secret for SIP created ',
    group: group,
    coerce: coerceRemove,
    implies: ['video-sip-call-created-url'],
  },
  'video-sip-call-destroyed-url': {
    description: 'URL for SIP destroyed',
    coerce: coerceRemoveCallback(coerceUrl('video-sip-call-destroyed-url')),
    group: group,
  },
  'video-sip-call-destroyed-secret': {
    description: 'Secret for SIP destroyed',
    group: group,
    coerce: coerceRemove,
    implies: ['video-sip-call-destroyed-url'],
  },
  'video-sip-call-mute-forced-url': {
    description: 'URL for SIP call muted',
    coerce: coerceRemoveCallback(coerceUrl('video-sip-call-mute-forced-url')),
    group: group,
  },
  'video-sip-call-mute-forced-secret': {
    description: 'Secret for call muted SIP',
    group: group,
    coerce: coerceRemove,
    implies: ['video-sip-call-mute-forced-url'],
  },
  'video-sip-call-updated-url': {
    description: 'URL for SIP updated',
    coerce: coerceRemoveCallback(coerceUrl('video-sip-call-updated-url')),
    group: group,
  },
  'video-sip-call-updated-secret': {
    description: 'Secret for SIP updated',
    group: group,
    coerce: coerceRemove,
    implies: ['video-sip-call-updated-url'],
  },
  'video-stream-created-url': {
    description: 'URL for stream created',
    coerce: coerceRemoveCallback(coerceUrl('video-stream-created-url')),
    group: group,
  },
  'video-stream-created-secret': {
    description: 'Secret for stream created',
    group: group,
    coerce: coerceRemove,
    implies: ['video-stream-created-url'],
  },
  'video-stream-destroyed-url': {
    description: 'URL for stream destroyed',
    coerce: coerceRemoveCallback(coerceUrl('video-stream-destroyed-url')),
    group: group,
  },
  'video-stream-destroyed-secret': {
    description: 'Secret for stream destroyed',
    group: group,
    coerce: coerceRemove,
    implies: ['video-stream-destroyed-url'],
  },
};

exports.updateVideo = updateVideo;

exports.videoGroup = group;

exports.videoFlags = videoFlags;

exports.videoWebhooks = videoWebhooks;
