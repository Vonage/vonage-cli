process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const {
  getTestApp,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
  addRTCCapabilities,
  addNetworkCapabilities,
  addVBCCapabilities,
  addVideoCapabilities,
} = require('../../app');
const {
  handler,
  coerceCapability,
} = require('../../../src/commands/apps/list');
const { mockConsole } = require('../../helpers');
const { Vonage } = require('@vonage/server-sdk');

jest.mock('@vonage/server-sdk');

describe('Command: vonage apps', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('Will list applications when there are none', async () => {
    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield* [];
    });

    await handler({ SDK: sdk });

    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log).toHaveBeenCalledWith('No applications found');
  });

  test('Will list one application that does not have any capabilities', async () => {
    const app = getTestApp();
    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield app;
    });

    await handler({ SDK: sdk });

    expect(Vonage._mockListAllApplications).toHaveBeenCalledTimes(1);
    expect(consoleMock.table).toHaveBeenCalledWith([
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
    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield appOne;
      yield appTwo;
    });

    await handler({ SDK: sdk });

    expect(consoleMock.table).toHaveBeenCalledWith([
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

    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield appOne;
      yield appTwo;
      yield appThree;
    });

    await handler({ SDK: sdk, appName: appTwo.name.substring(0, 3) });

    expect(consoleMock.table).toHaveBeenCalledWith([
      {
        'App ID': appTwo.id,
        'Capabilities': 'None',
        'Name': appTwo.name,
      },
    ]);
  });

  test('Will filter capabilities using single equality', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = getTestApp();
    const appThree = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));

    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield appOne;
      yield appTwo;
      yield appThree;
    });

    await handler({
      SDK: sdk,
      capability: coerceCapability('voice'),
    });

    expect(consoleMock.table).toHaveBeenCalledWith([
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

    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield appOne;
      yield appTwo;
      yield appThree;
    });

    await handler({
      SDK: sdk,
      capability: coerceCapability('voice,messages'),
    });

    expect(consoleMock.table).toHaveBeenCalledWith([
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

    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield appOne;
      yield appTwo;
      yield appThree;
    });

    await handler({
      SDK: sdk,
      capability: coerceCapability('voice+messages'),
    });

    expect(consoleMock.table).toHaveBeenCalledWith([
      {
        'App ID': appTwo.id,
        'Capabilities': 'Messages, Voice',
        'Name': appTwo.name,
      },
    ]);
  });

  test('Will output JSON', async () => {
    const app = getTestApp();
    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield app;
    });

    await handler({ SDK: sdk, json: true });

    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log).toHaveBeenCalledWith(JSON.stringify([app], null, 2));
  });

  test('Will output YAML', async () => {
    const app = getTestApp();
    const sdk = Vonage();

    Vonage._mockListAllApplications.mockImplementation(async function* () {
      yield app;
    });

    await handler({ SDK: sdk, yaml: true });

    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log).toHaveBeenCalledWith(yaml.stringify([app], null, 2));
  });

  test('Should error when capability is not valid', async () => {
    expect(() => coerceCapability('invalid'))
      .toThrow('Invalid capability. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed');

    expect(() => coerceCapability('invalid,foo'))
      .toThrow('Invalid capability. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed');

    expect(() => coerceCapability('invalid+foo'))
      .toThrow('Invalid capability. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed');
  });
});
