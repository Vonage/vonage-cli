process.env.FORCE_COLOR = 0;
const {
  getTestApp,
  addVerifyCapabilities,
  addMeetingsCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} = require('../app');
const { handler } = require('../../src/commands/apps');
describe('Command: vonage apps', () => {
  test('Will test', () => {
    expect(true).toBe(true);
  });
});
