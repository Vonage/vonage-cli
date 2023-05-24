import { ux } from '@oclif/core';
import { parse } from 'path';
import debug from 'debug';
import chalk from 'chalk';
import { dumpValue } from './ux';
import { normalize } from 'path';
import { readFile, dirExists, writeFile, createDir } from './fsUtils';

const log = debug('vonage:cli:fs');

export const loadFile = (file: string): string | null => {
  const normalFile = normalize(file);
  log(`Loading file ${file}`);
  if (!pathExists(normalFile)) {
    log(`${file} does not exist`);
    return null;
  }

  const fileContents = readFile(normalFile);
  log(`Contents of ${normalFile}: `, fileContents);
  return fileContents;
};

export const loadJSON = (file: string): unknown =>
  JSON.parse(loadFile(file) || '{}');

export const pathExists = (path: string) => {
  const normalPath = normalize(path);
  log(`Checking if ${normalPath} exists`);

  if (dirExists(normalPath)) {
    log(`${normalPath} exists`);
    return true;
  }

  log(`${normalPath} does not exist`);
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
      chalk.bold(`Directory ${directory} does not exist. Create it? [y/n]`),
    );
  }

  if (!okToMake) {
    log('Not creating directory');
    return false;
  }

  createDir(directory);
  log('Directory created');
  return true;
};

export const saveFile = async (
  file: string,
  data: string | unknown,
  force = false,
): Promise<boolean> => {
  const normalFile = normalize(file);

  log(`Saiving file ${normalFile}. Forcing? ${force}`);
  const fileExistsWarning = pathExists(normalFile)
    ? chalk.yellow('This will overwrite the file')
    : chalk.yellow('This will create the file');

  let okToWrite = true;
  if (!force) {
    ux.log('Confirm saving:');
    ux.log(dumpValue(data));
    okToWrite = await ux.confirm(`To ${file} (${fileExistsWarning}) [y/n]`);
  }

  if (!okToWrite) {
    log(`Not saving file ${file}: User declined saving`);
    return false;
  }

  // Check directory and ask to create
  okToWrite = !checkDirectoryExistsForFile(file)
    ? await makeDirectoryForFile(file, force)
    : true;

  if (!okToWrite) {
    log(`Not saving file ${file}: directory does not exist`);
    return false;
  }

  log(`Data type: ${typeof data}`);
  const dataToWrite
    = typeof data !== 'string' ? JSON.stringify(data, null, 2) : data;

  writeFile(file, dataToWrite);

  log(`Saiving file ${file}`);
  log(`File written`);
  return true;
};
