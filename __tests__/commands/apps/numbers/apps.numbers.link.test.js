process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../../app.js';
import { mockConsole } from '../../../helpers.js';
import { getTestPhoneNumber } from '../../../numbers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  '../../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  'yargs': (() => ({ default: yargs }))(),
};





const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/numbers/link.js', __moduleMocks);

describe('Command: vonage apps numbers link', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Will link numbers to an app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(appMock, app.id);
    assertCalledWith(numbersMock, {
      pattern: numberNine.msisdn,
      index: 1,
      size: 100,
    });
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assertCalledWith(updateMock, {
      ...numberNine,
      appId: app.id,
    });
  });

  test('Will link number to an app and output json', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
      json: true,
    });

    assertCalledWith(appMock, app.id);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.ok(updateMock.mock.callCount() > 0);
    assertCalledWith(console.log, JSON.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    ));
  });

  test('Will link number to an app and output yaml', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
      yaml: true,
    });

    assertCalledWith(appMock, app.id);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.ok(updateMock.mock.callCount() > 0);
    assertCalledWith(console.log, yaml.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    ));
  });

  test('Will link numbers to an app after confirming', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(confirmMock, `Number is already linked to application [${otherAppId}]. Do you want to continue?`);
    assertCalledWith(updateMock, {
      ...numberNine,
      appId: app.id,
    });
  });

  test('Will do nothing when number already linked', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: app.id,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(appMock, app.id);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  test('Wont link numbers to an app after does not confirm', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(appMock, app.id);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(confirmMock.mock.callCount() > 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  test('Will exit 20 when no numbers are found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [],
    }));

    const updateMock = mock.fn();

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(appMock, app.id);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 20);
  });
});

