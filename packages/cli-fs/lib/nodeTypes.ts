import { normalize, parse } from 'node:path';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';

export type NodeReadFile = typeof readFileSync;
export type NodeExists = typeof existsSync;
export type NodeNormalize = typeof normalize;
export type NodeParse = typeof parse;
export type NodeMkdir = typeof mkdirSync;
export type NodeWriteFile = typeof writeFileSync;

