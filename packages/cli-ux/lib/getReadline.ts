import readline  from 'node:readline';

export type BuildReadline = () => readline.Interface;

export const buildReadline = (
  rl?: readline.ReadLine,
): BuildReadline => () => rl || readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
