process.env.FORCE_COLOR = 0;

import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
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
import { table } from '../../../src/ux/table.js';
import { Client } from '@vonage/server-client';

test('Command: vonage apps', { concurrency: 1 }, async (ctx) => {
  const spinnerMock = mock.fn();
  const makeSDK = (listAllApplications) => ({
    applications: { listAllApplications },
  });

  ctx.mock.module(
    '../../../src/ux/spinner.js',
    {
      namedExports: { spinner: spinnerMock },
    }
  );

  const { handler, coerceCapability } = await import('../../../src/commands/apps/list.js');

  ctx.beforeEach(() => {
    spinnerMock.mock.resetCalls();
    spinnerMock.mock.mockImplementation(() => ({ stop: mock.fn(), fail: mock.fn() }));
    mockConsole();
  });

  await ctx.test('Will list applications when there are none', async () => {
    const sdk = makeSDK(async function*() { yield* []; });

    await handler({ SDK: sdk });

    assert.strictEqual(console.log.mock.calls[0]?.arguments[0], 'No applications found');
  });

  await ctx.test('Will list one application that does not have any capabilities', async () => {
    const app = getTestApp();
    const listAllApplications = mock.fn(async function*() { yield app; });
    const sdk = makeSDK(listAllApplications);

    await handler({ SDK: sdk });

    ctx.diagnostic(console.log.mock);

    assert.strictEqual(listAllApplications.mock.callCount(), 1);
    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': app.id,
          'Name': app.name,
          'Capabilities': 'None',
        },
      ]));
  });

  await ctx.test('Will list one application that has all capabilities', async () => {
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

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appOne.id,
          'Name': appOne.name,
          'Capabilities': 'Messages, Network APIs, RTC, VBC, Verify, Video, Voice',
        },
        {
          'App ID': appTwo.id,
          'Name': appTwo.name,
          'Capabilities': 'None',
        },
      ])
    );
  });


  await ctx.test('Will filter by application name', async () => {
    const appOne = getTestApp();
    const appTwo = getTestApp();
    const appThree = getTestApp();
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, appName: appTwo.name });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appTwo.id,
          'Name': appTwo.name,
          'Capabilities': 'None',
        },
      ]),
    );
  });

  await ctx.test('Will filter capabilities using single equality', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = getTestApp();
    const appThree = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice') });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appOne.id,
          'Name': appOne.name,
          'Capabilities': 'Voice',
        },
        {
          'App ID': appThree.id,
          'Name': appThree.name,
          'Capabilities': 'Messages, Voice',
        },
      ]));
  });

  await ctx.test('Will filter capabilities using multiple equality', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = getTestApp();
    const appThree = addMessagesCapabilities(getTestApp());
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice,messages') });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appOne.id,
          'Name': appOne.name,
          'Capabilities': 'Voice',
        },
        {
          'App ID': appThree.id,
          'Name': appThree.name,
          'Capabilities': 'Messages',
        },
      ])
    );
  });

  await ctx.test('Will filter capabilities using or', async () => {
    const appOne = addVoiceCapabilities(getTestApp());
    const appTwo = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));
    const appThree = addMessagesCapabilities(getTestApp());
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice+messages') });

    assert.strictEqual(

      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appTwo.id,
          'Name': appTwo.name,
          'Capabilities': 'Messages, Voice',
        },
      ])
    );
  });

  await ctx.test('Will filter capabilities using and and exclude applications with extra capabilities', async () => {
    const appOne = addVoiceCapabilities(addMessagesCapabilities(getTestApp()));
    const appTwo = addVoiceCapabilities(addMessagesCapabilities(addRTCCapabilities(getTestApp())));
    const appThree = addVoiceCapabilities(getTestApp());
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; yield appThree; });

    await handler({ SDK: sdk, capability: coerceCapability('voice+messages') });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appOne.id,
          'Name': appOne.name,
          'Capabilities': 'Messages, Voice',
        },
      ])
    );
  });

  await ctx.test('Will filter by application name case insensitively', async () => {
    const appOne = getTestApp();
    const appTwo = getTestApp();
    const sdk = makeSDK(async function*() { yield appOne; yield appTwo; });

    await handler({ SDK: sdk, appName: appTwo.name.toUpperCase() });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      table([
        {
          'App ID': appTwo.id,
          'Name': appTwo.name,
          'Capabilities': 'None',
        },
      ]),
    );
  });

  await ctx.test('Will output JSON', async () => {
    const app = getTestApp();
    const sdk = makeSDK(async function*() { yield app; });

    await handler({ SDK: sdk, json: true });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      JSON.stringify([Client.transformers.snakeCaseObjectKeys(app, true)], null, 2)
    );
  });

  await ctx.test('Will output YAML', async () => {
    const app = getTestApp();
    const sdk = makeSDK(async function*() { yield app; });

    await handler({ SDK: sdk, yaml: true });

    assert.strictEqual(
      console.log.mock.calls[1].arguments[0],
      yaml.stringify([Client.transformers.snakeCaseObjectKeys(app, true)], null, 2)
    );
  });

  await ctx.test('Will error when capability is not valid', async () => {
    assert.throws(() => coerceCapability('invalid'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);

    assert.throws(() => coerceCapability('invalid,foo'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);

    assert.throws(() => coerceCapability('invalid+foo'), /Invalid capability\. Only: messages, network_apis, rtc, vbc, verify, video, voice are allowed/);
  });
});
