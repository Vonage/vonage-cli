const { coerceUrl } = require('../../utils/coerceUrl');

const group = 'Video Capabilities';

const videoFlags = {
  'video-session-url': {
    description: 'Session monitoring Live updates of session events',
    coerce: coerceUrl('video-session-url'),
    group: group,
  },
  'video-session-secret': {
    description: 'Signature secret for session webhooks',
    group: group,
  },
  'video-recordings-url': {
    description: 'Recordings call back URL and new recordings alerts',
    coerce: coerceUrl('video-recordings-url'),
    group: group,
  },
  'video-recordings-secret': {
    description: 'Signature secret for recording webhooks ',
    group: group,
  },
  'video-monitoring-stream-url': {
    description: 'Monitoring live streaming broadcast status changes',
    coerce: coerceUrl('video-monitoring-stream-url'),
    group: group,
  },
  'video-monitoring-stream-secret': {
    description: 'Signature secret for monitoring webhooks ',
    group: group,
  },
  'video-composer-url': {
    description: 'URL to receive Experience Composer events',
    coerce: coerceUrl('video-composer-url'),
    group: group,
  },
  'video-composer-secret': {
    description: 'Signature secret for composer webhooks',
    group: group,
  },
  'video-caption-url': {
    description: 'Caption callback URL',
    coerce: coerceUrl('video-caption-url'),
    group: group,
  },
  'video-caption-secret': {
    description: 'Signature secret for caption webhooks',
    group: group,
  },
};

exports.videoGroup = group;
exports.videoFlags = videoFlags;
