import { messageDataSets } from './messageCapabilities.js';
import { networkDataSets } from './networkCapabilities.js';
import { rtcDataSets } from './rtcCapabilities.js';
import { verifyDataSets } from './verifyCapabilities.js';
import { videoDataSets } from './videoCapabilities.js';
import { voiceDataSets } from './voiceCapabilities.js';

export const dataSets = [
  {
    label: 'messages',
    testCases: messageDataSets,
  },
  {
    label: 'networkApis',
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
