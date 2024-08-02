import chalk from 'chalk';
import { PathExistsCurry } from './pathExists';
import { debugFsLog } from './fsDebug';
import { ConfirmCurry } from '../ux';
import { NodeParse, NodeMkdir } from './nodeTypes';

export type CheckDirectoryExistsForFile = (
  exists: PathExistsCurry,
  parse: NodeParse,
  file: string,
) => boolean;

export type CheckDirectoryExistsForFileCurry = (file: string) => boolean;

export const checkDirectoryExistsForFile: CheckDirectoryExistsForFile = (
  exists: PathExistsCurry,
  parse: NodeParse,
  file: string,
): boolean => {
  const { dir } = parse(file);
  debugFsLog(`Checking if directory exists for ${file}`);
  return exists(dir);
};

export type MakeDirectory = (
  createDir: NodeMkdir,
  exists: PathExistsCurry,
  confirm: ConfirmCurry,
  force: boolean,
  directory: string,
) => Promise<boolean>;

export type MakeDirectoryCurry = (directory: string) => Promise<boolean>;

export const makeDirectory: MakeDirectory = async (
  createDir: NodeMkdir,
  exists: PathExistsCurry,
  confirm: ConfirmCurry,
  force: boolean,
  directory: string,
): Promise<boolean> => {
  debugFsLog(`Creating directory ${directory}`);
  let okToMake = force;

  if (!exists(directory) && !force) {
    okToMake = await confirm(chalk.bold(`Directory ${directory} does not exist. Create it? [y/n]`));
  }

  if (!okToMake) {
    debugFsLog('Not creating directory');
    return false;
  }

  createDir(directory);
  debugFsLog('Directory created');
  return true;
};


export type MakeDirectoryForFile = (
  makeDirectory: MakeDirectoryCurry,
  parse: NodeParse,
  file: string,
) => Promise<boolean>;

export type MakeDirectoryForFileCurry = (file: string) => Promise<boolean>;

export const makeDirectoryForFile = async (
  makeDirectory: MakeDirectoryCurry,
  parse: NodeParse,
  file: string,
): Promise<boolean> => {
  const { dir } = parse(file);
  debugFsLog(`Creating directory for ${file}`);
  return makeDirectory(dir);
};
