import { BuildReadline } from './getReadline';

export type Prompt = (
  buildReadline: BuildReadline,
  message: string,
) => Promise<string>;

export type PromptCurry = (message: string) => Promise<string>;

export const prompt: Prompt = (
  buildReadline: BuildReadline,
  message: string,
): Promise<string> => new Promise((resolve) => {
  const rl = buildReadline();

  rl.question(`${message} `, (answer) => {
    resolve(answer);
    rl.close();
  });
});
