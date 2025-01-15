const fetch = require('node-fetch');
const { compareVersions } = require('compare-versions');
const { getSettings, setSetting } = require('../utils/settings');

const now = new Date();


exports.checkForUpdate = async () => {
  let lastUpdateCheck;
  const checkDate = parseInt(`${now.getFullYear()}${now.getMonth()+1}${now.getDate()}`);
  const settings = getSettings();
  if (settings.needsUpdate) {
    return;
  }

  lastUpdateCheck = settings.lastUpdateCheck
    ? parseInt(settings.lastUpdateCheck)
    // Set to current date since this could be the first time the user is
    // running the CLI
    : checkDate;

  console.debug(`Last update check: ${lastUpdateCheck}`);

  if (!settings.lastUpdateCheck) {
    setSetting('lastUpdateCheck', lastUpdateCheck);
  }

  if (checkDate >= lastUpdateCheck) {
    console.debug('Skipping update check');
    return;
  }

  console.debug('Checking for updates...');
  const installedVersion = require('../../package.json').version;
  console.debug(`Installed version: ${installedVersion}`);

  const res = await fetch('https://registry.npmjs.org/@vonage/cli/latest');
  const registryPackageJson = await res.json();
  const latestVersion = registryPackageJson.version;
  const forceMinVersion = registryPackageJson?.vonageCli?.forceMinVersion || installedVersion;

  const needsUpdate = compareVersions(latestVersion, installedVersion) < 0;
  const forceUpdate = compareVersions(installedVersion, forceMinVersion) < 0;

  console.debug('Force min version:', forceMinVersion);
  console.debug(`Latest version: ${latestVersion}`);
  console.debug('Needs update:', needsUpdate);
  console.debug('Force update:', forceUpdate);

  setSetting('needsUpdate', needsUpdate);
  setSetting('forceUpdate', forceUpdate);
  setSetting('latestVersion', latestVersion);
  setSetting('forceMinVersion', forceMinVersion);
};
