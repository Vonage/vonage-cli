import assert from 'node:assert/strict';

export const buildMessagesSDK = (messageUUID) => {
  const sendMock = mock.fn(() => Promise.resolve({ messageUUID }));

  return {
    sendMock,
    sdkMock: {
      messages: {
        send: sendMock,
      },
    },
  };
};

export const assertSentMessage = (sendMock, MessageClass, params) => {
  assert.strictEqual(sendMock.mock.callCount(), 1);

  const [message] = sendMock.mock.calls[0].arguments;
  assert.deepStrictEqual(
    JSON.parse(JSON.stringify(message)),
    JSON.parse(JSON.stringify(new MessageClass(params))),
  );
};
