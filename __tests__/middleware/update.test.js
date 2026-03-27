import { jest, describe, test, beforeEach, expect } from '@jest/globals';
import { mockConsole } from '../helpers.js';

const getSettingsMock = jest.fn();
const setSettingMock = jest.fn();
const fetchMock = jest.fn();
const dumpCommandMock = jest.fn((cmd) => cmd);

jest.unstable_mockModule('../../src/utils/settings.js', () => ({
  getSettings: getSettingsMock,
  setSetting: setSettingMock,
}));

jest.unstable_mockModule('node-fetch', () => ({
  default: fetchMock,
}));

jest.unstable_mockModule('module', () => ({
  createRequire: () => () => ({ version: '1.0.0' }),
}));

jest.unstable_mockModule('../../src/ux/dump.js', () => ({
  dumpCommand: dumpCommandMock,
}));

const { checkForUpdate } = await import('../../src/middleware/update.js');

const makeFetchResponse = (data, ok = true) => ({
  ok,
  statusText: ok ? 'OK' : 'Not Found',
  json: jest.fn().mockResolvedValue(data),
});

const today = new Date();
const todayInt = parseInt(
  `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`,
);

describe('Middleware: Update', () => {
  let originalIsTTY;

  beforeEach(() => {
    mockConsole();
    getSettingsMock.mockReset();
    setSettingMock.mockReset();
    fetchMock.mockReset();
    dumpCommandMock.mockReset();
    dumpCommandMock.mockImplementation((cmd) => cmd);
    originalIsTTY = process.stdout.isTTY;
  });

  afterEach(() => {
    process.stdout.isTTY = originalIsTTY;
  });

  test('Skips everything when already notified today', async () => {
    getSettingsMock.mockReturnValue({ lastNotified: todayInt });

    await checkForUpdate();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(setSettingMock).not.toHaveBeenCalled();
  });

  test('Sets lastUpdateCheck on first run and skips fetch', async () => {
    getSettingsMock.mockReturnValue({});

    await checkForUpdate();

    expect(setSettingMock).toHaveBeenCalledWith('lastUpdateCheck', expect.any(Number));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('Skips fetch when last check was today and no pending update', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: todayInt,
    });

    await checkForUpdate();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('Fetches when last check was today but needsUpdate is pending', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: true,
      lastUpdateCheck: todayInt,
    });

    fetchMock.mockResolvedValue(
      makeFetchResponse({ version: '2.0.0' }),
    );

    await checkForUpdate();

    expect(fetchMock).toHaveBeenCalled();
  });

  test('Fetches registry and sets needsUpdate=true when a newer version exists', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(
      makeFetchResponse({ version: '2.0.0', vonageCli: { forceMinVersion: '1.0.0' } }),
    );

    await checkForUpdate();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://registry.npmjs.org/@vonage/cli/latest',
      { signal: expect.any(Object) },
    );
    expect(setSettingMock).toHaveBeenCalledWith('needsUpdate', true);
    expect(setSettingMock).toHaveBeenCalledWith('latestVersion', '2.0.0');
  });

  test('Does not output notification when stdout is piped', async () => {
    process.stdout.isTTY = false;

    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({ version: '2.0.0' }));

    await checkForUpdate();

    expect(console.log).not.toHaveBeenCalled();
    expect(setSettingMock).not.toHaveBeenCalledWith('lastNotified', expect.anything());
  });

  test('Does not output notification when already on latest version', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({ version: '1.0.0' }));

    await checkForUpdate();

    expect(console.log).not.toHaveBeenCalled();
    expect(setSettingMock).not.toHaveBeenCalledWith('lastNotified', expect.anything());
  });

  test('Sets needsUpdate=false when already on the latest version', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({ version: '1.0.0' }));

    await checkForUpdate();

    expect(setSettingMock).toHaveBeenCalledWith('needsUpdate', false);
  });

  test('Sets forceUpdate=true when installed version is below forceMinVersion', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(
      makeFetchResponse({ version: '2.0.0', vonageCli: { forceMinVersion: '1.5.0' } }),
    );

    await checkForUpdate();

    expect(setSettingMock).toHaveBeenCalledWith('forceUpdate', true);
  });

  test('Sets forceUpdate=false when installed version meets forceMinVersion', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(
      makeFetchResponse({ version: '2.0.0', vonageCli: { forceMinVersion: '0.9.0' } }),
    );

    await checkForUpdate();

    expect(setSettingMock).toHaveBeenCalledWith('forceUpdate', false);
  });

  test('Handles network errors gracefully without throwing', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockRejectedValue(new Error('Network failure'));

    await expect(checkForUpdate()).resolves.toBeUndefined();
    expect(setSettingMock).not.toHaveBeenCalledWith('needsUpdate', expect.anything());
  });

  test('Handles non-ok HTTP response gracefully without throwing', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({}, false));

    await expect(checkForUpdate()).resolves.toBeUndefined();
    expect(setSettingMock).not.toHaveBeenCalledWith('needsUpdate', expect.anything());
  });

  test('Handles missing version in registry response gracefully', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({ vonageCli: {} }));

    await expect(checkForUpdate()).resolves.toBeUndefined();
    expect(setSettingMock).not.toHaveBeenCalledWith('needsUpdate', expect.anything());
  });

  test('Updates lastUpdateCheck after a successful check', async () => {
    getSettingsMock.mockReturnValue({
      needsUpdate: false,
      lastUpdateCheck: 20200101,
    });

    fetchMock.mockResolvedValue(makeFetchResponse({ version: '1.0.0' }));

    await checkForUpdate();

    expect(setSettingMock).toHaveBeenCalledWith('lastUpdateCheck', expect.any(Number));
  });
});
