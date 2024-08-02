import chalk from 'chalk';
import { PathExistsCurry } from './pathExists';
import { debugFsLog } from './fsDebug';
import { ConfirmCurry, dumpValue } from '../ux';
import { NodeNormalize, NodeWriteFile } from './nodeTypes';
import { CheckDirectoryExistsForFileCurry, MakeDirectoryForFileCurry } from './directory';

export type SaveFile = (
  normalize: NodeNormalize,
  exists: PathExistsCurry,
  confirm: ConfirmCurry,
  checkDirectoryExistsForFile: CheckDirectoryExistsForFileCurry,
  makeDirectoryForFile: MakeDirectoryForFileCurry,
  writeFile: NodeWriteFile,
  force: boolean,
  file: string,
  data: string | unknown,
) => Promise<boolean>;

export type SaveFileCurry = (
  file: string,
  data: string | unknown
) => Promise<boolean>;

export const saveFile = async (
  normalize: NodeNormalize,
  exists: PathExistsCurry,
  confirm: ConfirmCurry,
  checkDirectoryExistsForFile: CheckDirectoryExistsForFileCurry,
  makeDirectoryForFile: MakeDirectoryForFileCurry,
  writeFile: NodeWriteFile,
  force: boolean,
  file: string,
  data: string | unknown,
): Promise<boolean> => {
  const normalFile = normalize(file);

  debugFsLog(`Saiving file ${normalFile}. Forcing? ${force}`);
  const fileExistsWarning = exists(normalFile)
    ? chalk.yellow('This will overwrite the file')
    : chalk.yellow('This will create the file');

  let okToWrite = await confirm([
    'Confirm Saving:',
    dumpValue(data),
    `To ${file} (${fileExistsWarning}) [y/n]`
  ].join('\n'));

  if (!okToWrite) {
    debugFsLog(`Not saving file ${file}: User declined saving`);
    return false;
  }

  // Check directory and ask to create
  okToWrite = !checkDirectoryExistsForFile(file)
    ? await makeDirectoryForFile(file)
    : true;

  if (!okToWrite) {
    debugFsLog(`Not saving file ${file}: directory does not exist`);
    return false;
  }

  debugFsLog(`Data type: ${typeof data}`);
  const dataToWrite = typeof data !== 'string'
    ? JSON.stringify(data, null, 2)
    : data;

  debugFsLog(`Saiving file ${file}`);
  writeFile(file, dataToWrite);
  debugFsLog('File written');
  return true;
};
