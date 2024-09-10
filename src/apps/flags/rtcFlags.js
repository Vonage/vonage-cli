const { coerceUrl } = require('../../utils/coerceUrl');

const group = 'RTC Capabilities';

const rtcFlags = {
  'rtc-event-url':{
    description: 'URL to receive RTC events',
    coerce: coerceUrl('rct-event-url'),
    group: group,
  },
  'rtc-signed-event':{
    description: 'Used signed webhook for RTC events',
    type: 'boolean',
    group: group,
  },
};

exports.rtcGroup = group;
exports.rtcFlags = rtcFlags;
