const { messageDataSets } = require('./messageCapabilities');
const { networkDataSets } = require('./networkCapabilities');
const { rtcDataSets } = require('./rtcCapabilities');
const { verifyDataSets } = require('./verifyCapabilities');
const { videoDataSets } = require('./videoCapabilities');
const { voiceDataSets } = require('./voiceCapabilities');

exports.dataSets = [
  ...messageDataSets,
  ...networkDataSets,
  ...rtcDataSets,
  ...verifyDataSets,
  ...videoDataSets,
  ...voiceDataSets,
];
