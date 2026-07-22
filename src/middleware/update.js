import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fetch from 'node-fetch';
import { compareVersions } from 'compare-versions';
import { getSettings, setSetting } from '../utils/settings.js';
import { NPM_REGISTRY_URL, AUTO_UPDATE_TIMEOUT } from '../utils/config.js';
import { dumpCommand } from '../ux/dump.js';

const formatDateAsInt = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`);
};

export const checkForUpdate = async () => {
  const now = new Date();
  const checkDate = formatDateAsInt(now);
  const settings = getSettings();

  // If we already notified today, nothing to do
  if (settings.lastNotified === checkDate) {
    return;
  }

  // Set to current date since this could be the first time the user is
  // running the CLI
  const lastUpdateCheck = settings.lastUpdateCheck
    ? parseInt(settings.lastUpdateCheck)
    : checkDate;

  if (!settings.lastUpdateCheck) {
    setSetting('lastUpdateCheck', lastUpdateCheck);
  }

  if (checkDate <= lastUpdateCheck && !settings.needsUpdate) {
    return;
  }

  const installedVersion = require('../../package.json').version;

  let registryPackageJson;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUTO_UPDATE_TIMEOUT);
    const res = await fetch(NPM_REGISTRY_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      return;
    }
    registryPackageJson = await res.json();
  } catch (err) {
    return;
  }

  const latestVersion = registryPackageJson?.version;
  if (!latestVersion) {
    return;
  }

  const forceMinVersion = registryPackageJson?.vonageCli?.forceMinVersion || installedVersion;

  const needsUpdate = compareVersions(installedVersion, latestVersion) < 0;
  const forceUpdate = compareVersions(installedVersion, forceMinVersion) < 0;

  setSetting('needsUpdate', needsUpdate);
  setSetting('forceUpdate', forceUpdate);
  setSetting('latestVersion', latestVersion);
  setSetting('forceMinVersion', forceMinVersion);
  setSetting('lastUpdateCheck', checkDate);

  if (needsUpdate && process.stdout.isTTY) {
    console.log(`An update is available for the Vonage CLI. Please update to version ${latestVersion}`);
    console.log(`Run ${dumpCommand(`npm install -g @vonage/cli@${latestVersion}`)} to update`);
    setSetting('lastNotified', checkDate);
  }
};
