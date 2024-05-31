import { jest } from '@jest/globals';
import {
  FSFactory, 
  LoadFileCurry,
  SaveFileCurry,
  PathExistsCurry,
  CheckDirectoryExistsForFileCurry,
  MakeDirectoryCurry,
  MakeDirectoryForFileCurry,
} from '@vonage/cli-fs';

export type MockFS = {
  pathExists: jest.MockedFunction<PathExistsCurry> & PathExistsCurry,
  loadFile: jest.MockedFunction<LoadFileCurry> & LoadFileCurry,
  checkDirectoryExistsForFile: jest.MockedFunction<CheckDirectoryExistsForFileCurry> & CheckDirectoryExistsForFileCurry,
  makeDirectory: jest.MockedFunction<MakeDirectoryCurry> & MakeDirectoryCurry,
  makeDirectoryForFile: jest.MockedFunction<MakeDirectoryForFileCurry> & MakeDirectoryForFileCurry,
  saveFile: jest.MockedFunction<SaveFileCurry> & SaveFileCurry,
} & FSFactory;

export const getMockFS = (): FSFactory => ({
  pathExists: jest.fn() as jest.MockedFunction<PathExistsCurry> & PathExistsCurry,
  loadFile: jest.fn() as jest.MockedFunction<LoadFileCurry> & LoadFileCurry,
  checkDirectoryExistsForFile: jest.fn() as jest.MockedFunction<CheckDirectoryExistsForFileCurry> & CheckDirectoryExistsForFileCurry,
  makeDirectory: jest.fn() as jest.MockedFunction<MakeDirectoryCurry> & MakeDirectoryCurry,
  makeDirectoryForFile: jest.fn() as jest.MockedFunction<MakeDirectoryForFileCurry> & MakeDirectoryForFileCurry,
  saveFile: jest.fn() as jest.MockedFunction<SaveFileCurry> & SaveFileCurry,
});

