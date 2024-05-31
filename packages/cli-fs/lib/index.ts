import { UXFactory, UXFlags } from '@vonage/cli-ux';
import { PathExistsCurry, pathExists } from './pathExists';
import { LoadFileCurry, loadFile } from './loadFile';
import { SaveFileCurry, saveFile } from './saveFile';
import {
  checkDirectoryExistsForFile,
  makeDirectory,
  makeDirectoryForFile,
  CheckDirectoryExistsForFileCurry,
  MakeDirectoryCurry,
  MakeDirectoryForFileCurry
} from './directory';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { normalize, parse } from 'node:path';
import { curry3, curry4, curry5, curry9 } from './fpUtils';

export * from './pathExists';
export * from './loadFile';
export * from './directory';
export * from './saveFile';

export type FSFactory = {
  pathExists: PathExistsCurry
  loadFile: LoadFileCurry
  checkDirectoryExistsForFile: CheckDirectoryExistsForFileCurry,
  makeDirectory: MakeDirectoryCurry,
  makeDirectoryForFile: MakeDirectoryForFileCurry,
  saveFile: SaveFileCurry,
};

export const defaultFSFlags = {
  force: false,
};

export const FSFactory = (
  flags?: Partial<typeof UXFlags | typeof defaultFSFlags | typeof UXFlags>,
): FSFactory => {
  const { confirm } = UXFactory(flags as Partial<typeof UXFlags>);
  const { force } =  {
    ...defaultFSFlags,
    ...flags,
  };

  const pathExistsCurry = curry3(pathExists)(existsSync)(normalize);
  const loadFileCurry = curry4(loadFile)(pathExistsCurry)(readFileSync)(normalize);

  const checkDirectoryExistsForFileCurry = curry3(checkDirectoryExistsForFile)(pathExistsCurry)(parse);
  const makeDirectoryCurry = curry5(makeDirectory)(mkdirSync)(pathExistsCurry)(confirm)(Boolean(force));
  const makeDirectoryForFileCurry = curry3(makeDirectoryForFile)(makeDirectoryCurry)(parse);

  const saveFileCurry = curry9(saveFile)(normalize)(pathExistsCurry)(confirm)(checkDirectoryExistsForFileCurry)(makeDirectoryForFileCurry)(writeFileSync)(Boolean(force));

  return {
    pathExists: pathExistsCurry,
    loadFile: loadFileCurry,

    checkDirectoryExistsForFile: checkDirectoryExistsForFileCurry,
    makeDirectory: makeDirectoryCurry,
    makeDirectoryForFile: makeDirectoryForFileCurry,

    saveFile: saveFileCurry as unknown as SaveFileCurry,
  };
};
