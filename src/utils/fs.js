import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { confirm } from '../ux/confirm.js';

class UserDeclinedError extends Error {
  constructor() {
    super('User declined to overwrite file');
    this.name = 'UserDeclinedError';
  }
}

const createDirectory = (directory) => {
  if (existsSync(directory)) {
    console.debug('Directory already exists');
    return true;
  }

  console.info(`Creating directory ${directory}`);
  mkdirSync(directory, { recursive: true });
  return true;
};

const checkOkToWrite = async (filePath, message = null) => {
  if (!existsSync(filePath)) {
    console.debug('File does not exist ok to write');
    return true;
  }

  console.debug('File exists, checking if ok to write');
  const okToWrite = await confirm(
    message ||
    `Overwirte file ${filePath}?`,
  );

  console.debug('Ok to write:', okToWrite);
  return okToWrite;
};

const writeFile = async (filePath, data, message) => {
  const okToWrite = await checkOkToWrite(filePath, message);
  if (!okToWrite) {
    console.debug('Not writing to file');
    throw new UserDeclinedError();
  }

  console.debug(`Writing to: ${filePath}`);

  writeFileSync(filePath, data);
  console.debug(`Data saved to ${filePath}`);
};

const writeJSONFile = async (filePath, data, message) => writeFile(
  filePath,
  JSON.stringify(data, null, 2),
  message,
);

export { UserDeclinedError };
export { createDirectory };
export { checkOkToWrite };
export { writeFile };
export { writeJSONFile };
