import { BuildReadline } from './getReadline';

export type Confirm = (
  buildReadline: BuildReadline,
  force: boolean,
  message: string,
) => Promise<boolean>;

export type ConfirmCurry = (message: string) => Promise<boolean>;

export const confirm: Confirm = (
  buildReadline: BuildReadline,
  force: boolean,
  message: string,
): Promise<boolean> => new Promise((resolve) => {
  if (force) {
    return resolve(true);
  }

  const rl = buildReadline();

  rl.question(`${message} [y/n] `, (answer) => {
    resolve(answer.toLowerCase() === 'y');
    rl.close();
  });
});
