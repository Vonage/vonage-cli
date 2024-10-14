const { messageDataSets } = require('./messageCapabilities');
const { networkDataSets } = require('./networkCapabilities');
const { rtcDataSets } = require('./rtcCapabilities');
const { verifyDataSets } = require('./verifyCapabilities');
const { videoDataSets } = require('./videoCapabilities');
const { voiceDataSets } = require('./voiceCapabilities');

exports.dataSets = [
  {
    label: 'message',
    testCases: messageDataSets,
  },
  {
    label: 'network',
    testCases: networkDataSets,
  },
  {
    label: 'rtc',
    testCases: rtcDataSets,
  },
  {
    label: 'verify',
    testCases: verifyDataSets,
  },
  {
    label: 'video',
    testCases: videoDataSets,
  },
  {
    label: 'voice',
    testCases: voiceDataSets,
  },
];
