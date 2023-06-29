/* istanbul ignore file: Mocking the filesystem is not fun  */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';

export const readFile = (file: string): string => readFileSync(file).toString();

export const writeFile = (file: string, dataToWrite: string) =>
  writeFileSync(file, dataToWrite);

export const dirExists = (dir: string): boolean => existsSync(dir);

export const createDir = (dir: string) => mkdirSync(dir, { recursive: true });
