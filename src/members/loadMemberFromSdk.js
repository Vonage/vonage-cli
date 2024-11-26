const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

exports.loadMemberFromSDK = async (SDK, conversationId, memberId) => {
  console.info(`Loading member ${memberId} for conversation ${conversationId} through API`);
  const { stop: loadStop, fail: loadFail } = spinner({ message: 'Fetching member' });
  try {
    const member = await SDK.conversations.getMember(conversationId, memberId);
    console.debug('Member loaded', member);
    loadStop();
    return member;
  } catch (error) {
    loadFail();
    sdkError(error);
    return;
  }
};
