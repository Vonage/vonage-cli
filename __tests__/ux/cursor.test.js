import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { hideCursor, resetCursor } from '../../src/ux/cursor.js';

describe('Utils: cursor', () => {
  let stdoutSpy;
  let stderrSpy;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  test('resetCursor writes nothing when the cursor was never hidden', () => {
    resetCursor();

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(stderrSpy).not.toHaveBeenCalled();
  });

  test('resetCursor shows the cursor after hideCursor was called', () => {
    hideCursor();
    stdoutSpy.mockClear();
    stderrSpy.mockClear();

    resetCursor();

    expect(stdoutSpy).toHaveBeenCalledWith('\u001B[?25h');
    expect(stderrSpy).toHaveBeenCalledWith('\u001B[?25h');
  });

  test('resetCursor is a no-op the second time it is called in a row', () => {
    hideCursor();
    resetCursor();
    stdoutSpy.mockClear();
    stderrSpy.mockClear();

    resetCursor();

    expect(stdoutSpy).not.toHaveBeenCalled();
    expect(stderrSpy).not.toHaveBeenCalled();
  });
});
