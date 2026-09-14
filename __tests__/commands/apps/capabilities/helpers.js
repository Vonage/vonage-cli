import assert from 'node:assert/strict';
import { mock } from 'node:test';

export const buildApplicationsSdk = (app) => {
  const getApplication = mock.fn(() => Promise.resolve({ ...app }));
  const updateApplication = mock.fn(() => Promise.resolve());

  return {
    getApplication,
    updateApplication,
    SDK: {
      applications: {
        getApplication,
        updateApplication,
      },
    },
  };
};

export const runUpdateCapabilityTest = async ({ handler, testCase, exitMock }) => {
  const { app, args, expected } = testCase;
  const { SDK, getApplication, updateApplication } = buildApplicationsSdk(app);

  await handler({
    SDK,
    id: app.id,
    ...args,
  });

  assert.strictEqual(exitMock.mock.callCount(), 0);
  assert.deepStrictEqual(getApplication.mock.calls[0].arguments, [app.id]);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(updateApplication.mock.calls[0].arguments)), JSON.parse(JSON.stringify([expected])));
};

export const runRemoveCapabilityTest = async ({
  handler,
  testCase,
  exitMock,
  confirmMock,
  confirmed,
}) => {
  const { app, args, expected } = testCase;
  const { SDK, getApplication, updateApplication } = buildApplicationsSdk(app);

  confirmMock.mock.mockImplementation(() => Promise.resolve(confirmed));

  await handler({
    SDK,
    id: app.id,
    ...args,
  });

  assert.strictEqual(exitMock.mock.callCount(), 0);
  assert.deepStrictEqual(getApplication.mock.calls[0].arguments, [app.id]);

  if (confirmed) {
    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateApplication.mock.calls[0].arguments)), JSON.parse(JSON.stringify([expected])));
    return;
  }

  assert.strictEqual(updateApplication.mock.callCount(), 0);
};
