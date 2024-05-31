import { debugFsLog } from './fsDebug';
import { PathExistsCurry } from './pathExists';
import { NodeReadFile, NodeNormalize } from './nodeTypes';

export type LoadFile = (
  pathExists: PathExistsCurry,
  readFile: NodeReadFile,
  normalize: NodeNormalize,
  file: string
) => string | null;

export type LoadFileCurry = (file: string) => string | null;

export const loadFile: LoadFile = (
  pathExists: PathExistsCurry,
  readFile: NodeReadFile,
  normalize: NodeNormalize,
  file: string
): string | null => {
  const normalFile = normalize(file);
  debugFsLog(`Loading file ${file}`);
  if (!pathExists(normalFile)) {
    debugFsLog(`${file} does not exist`);
    return null;
  }

  const fileContents = readFile(normalFile).toString();
  debugFsLog(`Contents of ${normalFile}: `, fileContents);
  return fileContents;
};

