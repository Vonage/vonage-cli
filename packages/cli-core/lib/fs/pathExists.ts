import { debugFsLog } from './fsDebug';
import { NodeExists, NodeNormalize } from './nodeTypes';

export type PathExists = (
  exists: NodeExists,
  normalize: NodeNormalize,
  path: string,
) => boolean;

export type PathExistsCurry = (path: string) => boolean;

export const pathExists: PathExists = (
  exists: NodeExists,
  normalize: NodeNormalize,
  path: string
): boolean => {
  const normalPath = normalize(path);
  debugFsLog(`Checking if ${normalPath} exists`);

  if (exists(normalPath)) {
    debugFsLog(`${normalPath} exists`);
    return true;
  }

  debugFsLog(`${normalPath} does not exist`);
  return false;
};

