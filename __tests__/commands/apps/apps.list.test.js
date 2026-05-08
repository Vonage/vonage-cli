process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import {
  getTestApp,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
  addRTCCapabilities,
  addNetworkCapabilities,
  addVBCCapabilities,
  addVideoCapabilities,
} from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const spinnerMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
  '../../../src/ux/spinner.js': (() => ({ spinner: spinnerMock }))(),
};





const { handler, coerceCapability } = await loadModule(import.meta.url, '../../../src/commands/apps/list.js', __moduleMocks);

const makeSDK = (listAllApplications) => ({
  applications: { listAllApplications },
});

describe('Command: vonage apps', () => {
  beforeEach(() => {
    spinnerMock.mock.resetCalls();
    spinnerMock.mock.mockImplementation(() => ({ stop: mock.fn(), fail: mock.fn() }));
    mockConsole();
  });

  test('Will list applications when there are none', async () => {
    const sdk = makeSDK(async function*() { yield* []; });

    await handler({ SDK: sdk });

    assert.strictEqual(console.table.mock.callCount(), 0);
    assertCalledWith(console.log, 'No applications found');
  });

  test('Will list one application that does not have any capabilities', async () => {
    const app = getTestApp();
    const listAllApplications = mock.fn(async function*() { yield app; });
    const sdk = makeSDK(listAllApplications);

    await handler({ SDK: sdk });

    assert.strictEqual(listAllApplications.mock.callCount(), 1);
    assertCalledWith(console.table, [
      {
        'App ID': app.id,
        'Capabilities': 'None',
        'Name': app.name,
      },
    ]);
  });

  test('Will list one application that has all capabilities', async () => {
    const appOne = addVideoCapabilities(
      addVBCCapabilities(
        addNetworkCapabilities(
          addRTCCapabilities(
            addVoiceCapabilities(
              addMessagesCapabilities(
                addVerifyCapabilities(
                  getTestApp(),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    const appTwo = getTestApp();
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; });

    await handler({ SDK: sdk });

    assertCalledWith(console.table, [
      {
        'App ID': appOne.id,
        'Capabilities': 'Messages, Network APIs, RTC, VBC, Verify, Video, Voice',
        'Name': appOne.name,
      },
      {
        'App ID': appTwo.id,
        'Capabilities': 'None',
        'Name': appTwo.name,
      },
    ]);
  });

  test('Will filter by application name', async () => {
    const appOne = getTestApp();
    const appTwo = getTestApp();
    const appThree = getTestApp();
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, appName: appTwo.name });

    assertNthCalledWith(console.table, 
      1,
      [
        {
          'App ID': appTwo.id,
          'Capabilities': 'None',
          'Name': appTwo.name,
        },
      ],
    );
  });

  test('Will filter capabilities using single equality', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = getTestApp();
    const appThree = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice') });

    assertCalledWith(console.table, [
      {
        'App ID': appOne.id,
        'Capabilities': 'Voice',
        'Name': appOne.name,
      },
      {
        'App ID': appThree.id,
        'Capabilities': 'Messages, Voice',
        'Name': appThree.name,
      },
    ]);
  });

  test('Will filter capabilities using multiple equality', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = getTestApp();
    const appThree = addMessagesCapabilities(getTestApp());
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice,messages') });

    assertCalledWith(console.table, [
      {
        'App ID': appOne.id,
        'Capabilities': 'Voice',
        'Name': appOne.name,
      },
      {
        'App ID': appThree.id,
        'Capabilities': 'Messages',
        'Name': appThree.name,
      },
    ]);
  });

  test('Will filter capabilities using or', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));
    const appThree = addMessagesCapabilities(getTestApp());
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice+messages') });

    assertCalledWith(console.table, [
      {
        'App ID': appTwo.id,
        'Capabilities': 'Messages, Voice',
        'Name': appTwo.name,
      },
    ]);
  });

  test('Will output JSON', async () => {
    const app = getTestApp();
    const sdk = makeSDK(async function*() { yield app; });

    await handler({ SDK: sdk, json: true });

    assert.strictEqual(console.table.mock.callCount(), 0);
    assertCalledWith(console.log, JSON.stringify([Client.transformers.snakeCaseObjectKeys(app, true)], null, 2));
  });

  test('Will output YAML', async () => {
    const app = getTestApp();
    const sdk = makeSDK(async function*() { yield app; });

    await handler({ SDK: sdk, yaml: true });

    assert.strictEqual(console.table.mock.callCount(), 0);
    assertCalledWith(console.log, yaml.stringify([Client.transformers.snakeCaseObjectKeys(app, true)], null, 2));
  });

  test('Will error when capability is not valid', async () => {
    assert.throws(() => coerceCapability('invalid'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);

    assert.throws(() => coerceCapability('invalid,foo'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);

    assert.throws(() => coerceCapability('invalid+foo'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);
  });

  test('Will exit 99 when API calls fails', async () => {
    const sdk = makeSDK(async function*() {
      yield* [];
      throw new Error('API Error');
    });

    await handler({ SDK: sdk });

    assert.strictEqual(console.table.mock.callCount(), 0);
    assertCalledWith(exitMock, 99);
  });
});

