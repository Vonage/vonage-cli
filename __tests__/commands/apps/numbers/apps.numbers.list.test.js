process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import { typeLabels } from '../../../../src/numbers/types.js';
import { buildCountryString } from '../../../../src/ux/locale.js';
import { mockConsole } from '../../../helpers.js';
import {
  getTestApp,
  addMessagesCapabilities,
  addVoiceCapabilities,
} from '../../../app.js';
import { getTestPhoneNumber } from '../../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/numbers/list.js', __moduleMocks);

describe('Command: vonage apps numbers list', () => {
  beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
  });

  test('Will list all numbers for application and warn about missing capability', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assertCalledWith(appMock, app.id);
    assertCalledWith(numbersMock, {
      applicationId: app.id,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(console.log, 
      2,
      'There is 1 number linked:',
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(console.table, [
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ]);

    assert.strictEqual(console.warn.mock.callCount(), 1);
    assertCalledWith(console.warn, 
      'This application does not have the voice or messages capability enabled',
    );

    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will not list numbers when there are none', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assertCalledWith(appMock, app.id);
    assertCalledWith(numbersMock, {
      index: 1,
      size: 100,
      applicationId: app.id,
    });

    assert.strictEqual(console.log.mock.callCount(), 4);
    assertNthCalledWith(console.log, 
      2,
      'No numbers linked to this application.',
    );

    assertNthCalledWith(console.log, 
      4,
      'Use vonage apps link to link a number to this application.',
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will not warn when application has voice', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assertNthCalledWith(console.log, 1, '');
    assertNthCalledWith(console.log, 2, 'There is 1 number linked:');
    assertNthCalledWith(console.log, 3, '');
    assert.strictEqual(console.table.mock.callCount(), 1);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will not warn when application has messages', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assertNthCalledWith(console.log, 1, '');
    assertNthCalledWith(console.log, 2, 'There is 1 number linked:');
    assertNthCalledWith(console.log, 3, '');
    assert.strictEqual(console.table.mock.callCount(), 1);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will exit 1 when there are numbers with no capabilities', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, fail: true });

    assertNthCalledWith(console.log, 1, '');
    assertNthCalledWith(console.log, 2, 'There is 1 number linked:');
    assertNthCalledWith(console.log, 3, '');
    assert.strictEqual(console.table.mock.callCount(), 1);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 1);
    assertCalledWith(console.error, 
      'This application does not have the voice or messages capability enabled',
    );

    assertCalledWith(exitMock, 1);
  });

  test('Will output JSON', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, json: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assertCalledWith(console.log, 
      JSON.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will output JSON with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, json: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assertCalledWith(console.log, 
      JSON.stringify(
        [],
        null,
        2,
      ),
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will output YAML', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, yaml: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assertCalledWith(console.log, 
      yaml.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  test('Will output YAML with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, yaml: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assertCalledWith(console.log, 
      yaml.stringify(
        [],
        null,
        2,
      ),
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });
});
