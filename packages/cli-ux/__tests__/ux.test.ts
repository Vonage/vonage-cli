import { describe, jest, expect } from '@jest/globals';
import chalk from 'chalk';
import { UXFactory, confirm, prompt } from '../lib';
import uxTests from './__dataSets__/ux';
import {
  getMockReadline,
  affirmativeConfirm,
  negativeConfirm,
  buildReadlineQuestionMock,
} from '../../../testHelpers/mocks';

describe('UX tests', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    expect(UXFactory().dumpValue(value)).toEqual(expected);
  });

  test('Will not truncate string', () => {
    expect(UXFactory().truncateString('a'.repeat(25))).toEqual(chalk.blue('a'.repeat(25)));
  });

  test('Will truncate long string', () => {
    expect(UXFactory({ truncate: 25}).truncateString('a'.repeat(25))).toEqual(chalk.blue('a'.repeat(25)));
  });

  test('Will not truncate string with length of 0', () => {
    expect(UXFactory({ truncate: 0}).truncateString('a'.repeat(25))).toEqual(chalk.blue('a'.repeat(25)));
  });

  test('Will confirm', async () => {
    const confirmReadline = getMockReadline();
    expect(await confirm(() => getMockReadline(), true, 'test')).toBe(true);
    expect(confirmReadline.question).not.toHaveBeenCalled();
    expect(confirmReadline.close).not.toHaveBeenCalled();

    confirmReadline.question = jest.fn().mockImplementationOnce(affirmativeConfirm);

    expect(await confirm(() => confirmReadline, false, 'test')).toBe(true);
    expect(confirmReadline.question).toHaveBeenCalledWith(
      'test [y/n] ',
      expect.any(Function),
    );
    expect(confirmReadline.close).toHaveBeenCalled();

    confirmReadline.question = jest.fn().mockImplementationOnce(negativeConfirm);

    expect(await confirm(() => confirmReadline, false, 'test')).toBe(false);
    expect(confirmReadline.question).toHaveBeenCalledWith(
      'test [y/n] ',
      expect.any(Function),
    );
    expect(confirmReadline.close).toHaveBeenCalled();
  });

  test('Will prompt', async () => {
    const confirmReadline = getMockReadline();

    confirmReadline.question =
      jest.fn().mockImplementationOnce(buildReadlineQuestionMock('test')
      );

    expect(await prompt(() => confirmReadline, 'test prompt')).toBe('test');
    expect(confirmReadline.question).toHaveBeenCalledWith(
      'test prompt ',
      expect.any(Function),
    );
    expect(confirmReadline.close).toHaveBeenCalled();
  });
});
