import { readFileSync, existsSync } from 'fs';
import {
  InvalidKeyFileError,
  InvalidKeyError,
} from '../errors/invalidKey.js';

export const coerceKey = (which) => (arg) => {
  if (!arg) {
    return arg;
  }

  if (arg.startsWith(`-----BEGIN ${which.toUpperCase()} KEY-----`)) {
    return arg;
  }

  if (!existsSync(arg)) {
    throw new InvalidKeyError();
  }

  const fileContents = readFileSync(arg, 'utf-8').toString();

  if (!fileContents.startsWith(`-----BEGIN ${which.toUpperCase()} KEY-----`)) {
    throw new InvalidKeyFileError();
  }

  return fileContents;
};
