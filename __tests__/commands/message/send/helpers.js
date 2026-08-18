import { mock } from 'node:test';

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
