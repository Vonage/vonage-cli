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





const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/numbers/unlink.js', __moduleMocks);

describe('Command: vonage apps numbers link', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Will unlink number from an app', async () => {
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
    assertCalledWith(numbersMock, {
      index: 1,
      pattern: numberNine.msisdn,
      size: 100,
    });
    assertCalledWith(confirmMock, `Are you sure you want to unlink ${numberNine.msisdn} from ${app.name}?`);
    assertCalledWith(updateMock, {
      ...numberNine,
    });
  });

  test('Will unlink number from an app and dump json', async () => {
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
      json: true,
    });

    assertCalledWith(appMock, app.id);
    assertCalledWith(updateMock, {
      ...numberNine,
    });
    assertCalledWith(console.log, 
      JSON.stringify(numberNine, null, 2),
    );
  });

  test('Will unlink number from an app and dump yaml', async () => {
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
      yaml: true,
    });

    assertCalledWith(appMock, app.id);
    assertCalledWith(updateMock, {
      ...numberNine,
    });
    assertCalledWith(console.log, 
      yaml.stringify(numberNine, null, 2),
    );
  });


  test('Will not unlink number from an app when user declines', async () => {
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

    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(confirmMock.mock.callCount() > 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  test('Will exit when number is not linked to an application', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ numbers: [numberNine] }));
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


    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  test('Will exit when number is linked to another application', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
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


    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  test('Will exit when no numbers are found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
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
  });
});

