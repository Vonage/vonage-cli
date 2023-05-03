/* istanbul ignore file: Mocking the filesystem is not fun  */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { ux } from '@oclif/core';
import { parse } from 'path';
import debug from 'debug';
import chalk from 'chalk';

const log = debug('vonage:cli:fs');

export const pathExists = (path: string) => {
  log(`Checking if ${path} exists`);

  if (existsSync(path)) {
    log(`${path} exists`);
    return true;
  }

  log(`${path} does not exist`);
  return false;
};

export const checkDirectoryExistsForFile = (file: string): boolean => {
  const { dir } = parse(file);
  log(`Checking if directory exists for ${file}`);
  return pathExists(dir);
};

export const makeDirectoryForFile = async (
  file: string,
  force = false,
): Promise<boolean> => {
  const { dir } = parse(file);
  log(`Creating directory for ${file}`);
  return makeDirectory(dir, force);
};

export const makeDirectory = async (
  directory: string,
  force = false,
): Promise<boolean> => {
  log(`Creating directory ${directory}`);
  let okToMake = force;

  if (!pathExists(directory) && !force) {
    okToMake = await ux.confirm(
      chalk.bold(`Directory ${directory} does not exist. Create it?`),
    );
  }

  if (!okToMake) {
    log('Not creating directory');
    return false;
  }

  mkdirSync(directory, { recursive: true });
  log('Directory created');
  return true;
};

export const saveFile = async (
  file: string,
  data: string | unknown,
  force = false,
): Promise<boolean> => {
  log(`Saiving file ${file}. Forcing? ${force}`);
  let okToWrite = !checkDirectoryExistsForFile(file)
    ? await makeDirectoryForFile(file, force)
    : true;

  // Check directory and ask to create

  if (!okToWrite) {
    log(`Not saving file ${file}: directory does not exist`);
    return false;
  }

  // Check if file exists and ask to overwrite
  if (pathExists(file) && !force) {
    okToWrite = await ux.confirm(
      chalk.bold(`File ${file} exists. Overwite it?`) + ' [y/n]',
    );
  }

  if (!okToWrite) {
    log(`Not saving file ${file}: file exists`);
    return false;
  }

  log(`Data type: ${typeof data}`);
  const dataToWrite
    = typeof data !== 'string' ? JSON.stringify(data, null, 2) : data;

  log(`Saiving file ${file}`);
  writeFileSync(file, dataToWrite);
  log(`File written`);
  return true;
};
