import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import EventEmitter from 'node:events';
import { exitAndShowCursor } from '../../src/ux/cursor.js';
import { mockConsole } from '../helpers.js';

test('UX: input tests', { concurrency: 1 }, async (ctx) => {
  const questionMock = mock.fn();
  const emitKeypressEventsMock = mock.fn();
  const rlOn = mock.fn();
  const rlOff = mock.fn();
  const readline = {};

  const inputMock = new EventEmitter();

  const closeMock = mock.fn(() => undefined);
  const oldStdoutWrite = process.stdout.write;
  const oldStderrWrite = process.stderr.write;
  const oldProcessExit = process.exit;
  const oldProcessKill = process.kill;
  const originalTTYDescriptor = Object.getOwnPropertyDescriptor(process.stdin, 'isTTY');
  const originalSetRawMode = process.stdin.setRawMode;

  const createInterface = mock.fn(() => ({
    question: questionMock,
    close: closeMock,
    emitKeypressEvents: emitKeypressEventsMock,
    input: inputMock,
    on: rlOn,
    off: rlOff,
  }));

  readline.createInterface = createInterface;
  readline.emitKeypressEvents = emitKeypressEventsMock;
  readline.input = inputMock;

  ctx.mock.module('readline', { defaultExport: readline });
  const { inputFromTTY } = await import('../../src/ux/input.js');

  ctx.beforeEach(() => {
    mockConsole();
    process.stdout.write = mock.fn();
    process.stderr.write = mock.fn();
    process.exit = mock.fn(() => {
      throw new Error('process.exit called');
    });
    process.kill = mock.fn();
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: false,
    });
    process.stdin.setRawMode = mock.fn();
  });

  ctx.afterEach(() => {
    questionMock.mock.resetCalls();
    emitKeypressEventsMock.mock.resetCalls();
    rlOn.mock.resetCalls();
    rlOff.mock.resetCalls();
    closeMock.mock.resetCalls();
    createInterface.mock.resetCalls();
    inputMock.removeAllListeners('keypress');

    process.stdout.write = oldStdoutWrite;
    process.stderr.write = oldStderrWrite;
    process.exit = oldProcessExit;
    process.kill = oldProcessKill;
    if (originalTTYDescriptor) {
      Object.defineProperty(process.stdin, 'isTTY', originalTTYDescriptor);
    } else {
      delete process.stdin.isTTY;
    }
    process.stdin.setRawMode = originalSetRawMode;
  });

  ctx.after(() => {
    process.stdout.write = oldStdoutWrite;
    process.stderr.write = oldStderrWrite;
    process.exit = oldProcessExit;
    process.kill = oldProcessKill;
    if (originalTTYDescriptor) {
      Object.defineProperty(process.stdin, 'isTTY', originalTTYDescriptor);
    }
    process.stdin.setRawMode = originalSetRawMode;
  });

  await ctx.test('Will capture printable keys', async () => {
    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const input = inputFromTTY({});

    const result = await input;

    assert.strictEqual(result, 'foo');
  });

  await ctx.test('Will stop collecting input when the configured length is reached', async () => {
    const onComplete = mock.fn();
    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);

    const result = await inputFromTTY({ length: 2, onComplete });

    assert.strictEqual(result, 'fo');
    assert.deepStrictEqual(onComplete.mock.calls[0].arguments, ['fo']);
  });

  await ctx.test('Will delete characters with delete key', async () => {
    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '', { name: 'delete' }), 13);

    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const input = inputFromTTY({});

    const result = await input;

    assert.strictEqual(result, 'fo');
  });

  await ctx.test('Will delete characters with backspace key', async () => {
    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '', { name: 'backspace' }), 13);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const input = inputFromTTY({});

    const result = await input;
    assert.strictEqual(result, 'fo');
  });

  await ctx.test('Will accept the hint when tab is pressed first', async () => {
    setTimeout(() => inputMock.emit('keypress', '\t', { name: 'tab', sequence: '\t' }), 10);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const result = await inputFromTTY({
      hint: '\u001B[32mhello\u001B[39m',
      echo: true,
    });

    assert.strictEqual(result, 'hello');
  });

  await ctx.test('Will use undefined output when echo is false', async () => {
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 10);

    await inputFromTTY({ echo: false });

    assert.deepStrictEqual(createInterface.mock.calls[0].arguments[0], {
      input: process.stdin,
      output: undefined,
      terminal: false,
    });
  });

  await ctx.test('Will reject immediately when the abort signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort('Stopped');

    await assert.rejects(inputFromTTY({ signal: controller.signal }), /Stopped/);
    assert.strictEqual(createInterface.mock.calls.length, 0);
  });

  await ctx.test('Will reject when the abort signal fires during input', async () => {
    const controller = new AbortController();
    const input = inputFromTTY({ signal: controller.signal });
    setTimeout(() => controller.abort('Timed out'), 10);

    await assert.rejects(input, /Timed out/);
  });

  await ctx.test('Will warn when readline close throws during cleanup', async () => {
    closeMock.mock.mockImplementation(() => {
      throw new Error('close failed');
    });

    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 10);

    await inputFromTTY({});

    assert.ok(
      console.warn.mock.calls.some(({ arguments: [value] }) =>
        String(value).includes('Attempted to close readline threw an error close failed')
      ),
    );
  });

  await ctx.test('Will log and exit when enabling raw mode fails', async () => {
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: true,
    });
    process.stdin.setRawMode = mock.fn(() => {
      throw new Error('raw mode failed');
    });
    process.exit = mock.fn(() => {
      throw new Error('exit 1');
    });

    await assert.rejects(inputFromTTY({}), /exit 1/);
    assert.ok(
      console.error.mock.calls.some(({ arguments: [value] }) =>
        String(value).includes('Attempted to start raw mode for STDIN failed with error: raw mode failed')
      ),
    );
  });

  await ctx.test('Will warn when disabling raw mode fails during cleanup', async () => {
    Object.defineProperty(process.stdin, 'isTTY', {
      configurable: true,
      value: true,
    });
    process.stdin.setRawMode = mock.fn((enabled) => {
      if (enabled === false) {
        throw new Error('raw mode off failed');
      }
    });

    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 10);

    await inputFromTTY({});

    assert.ok(
      console.warn.mock.calls.some(({ arguments: [value] }) =>
        String(value).includes('Turning off raw mode for STDIN failed with message raw mode off failed')
      ),
    );
  });

  await ctx.test('Will route control keys to process signals', async () => {
    setTimeout(() => inputMock.emit('keypress', '', { ctrl: true, name: 'c' }), 10);
    setTimeout(() => inputMock.emit('keypress', '', { ctrl: true, name: '\\' }), 11);
    setTimeout(() => inputMock.emit('keypress', '', { ctrl: true, name: 'z' }), 12);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    await inputFromTTY({});

    assert.deepStrictEqual(
      process.kill.mock.calls.map(({ arguments: args }) => args),
      [
        [process.pid, 'SIGINT'],
        [process.pid, 'SIGQUIT'],
        [process.pid, 'SIGTSTP'],
      ],
    );
  });
});

test('UX: terminal helpers', async (ctx) => {
  let moveCursor;
  let clearLine;
  ctx.mock.module('readline', {
    defaultExport: {
      moveCursor: (...args) => moveCursor(...args),
      clearLine: (...args) => clearLine(...args),
    },
  });
  const { clearScreen, clearPreviousLines, overwriteWithNewLine } = await import('../../src/ux/clear.js?terminal');
  await ctx.test('Will clear and overwrite terminal output', async () => {
    moveCursor = mock.fn();
    clearLine = mock.fn();
    const stream = { write: mock.fn() };

    clearScreen(stream);
    clearPreviousLines(2, stream);
    overwriteWithNewLine('done', stream);

    assert.deepStrictEqual(stream.write.mock.calls[0].arguments, ['\x1b[2J\x1b[0;0H']);
    assert.strictEqual(moveCursor.mock.calls.length, 2);
    assert.strictEqual(clearLine.mock.calls.length, 2);
    assert.deepStrictEqual(stream.write.mock.calls[1].arguments, ['\r\x1b[2Kdone']);
    assert.deepStrictEqual(stream.write.mock.calls[2].arguments, ['\n']);
  });

  await ctx.test('Will restore the cursor when requested', () => {
    process.stdout.write = mock.fn();
    process.stderr.write = mock.fn();

    exitAndShowCursor();

    assert.deepStrictEqual(process.stderr.write.mock.calls[0].arguments, ['\u001B[?25h']);
    assert.deepStrictEqual(process.stdout.write.mock.calls[0].arguments, ['\u001B[?25h']);
  });
});

test('UX: output mode detection', async (ctx) => {
  let parserImplementation;
  const parser = () => ({ accessibility: true, plainOutput: true, replayRate: 9 });
  ctx.mock.module('yargs-parser', {
    defaultExport: (...args) => parserImplementation(...args),
  });
  const oldEnv = process.env;

  ctx.afterEach(() => {
    process.env = oldEnv;
  });

  await ctx.test('Will detect screen reader and plain output settings', async () => {
    process.env = {
      ...oldEnv,
      SCREENREADER: 'enabled',
    };

    parserImplementation = parser;
    const { detectScreenReader, detectPlainOutput } = await import('../../src/ux/detectScreenReader.js?env');

    assert.strictEqual(detectScreenReader(), true);
    assert.strictEqual(detectPlainOutput(), true);
  });

  await ctx.test('Will use parser flags and replay rate defaults', async () => {
    process.env = {
      ...oldEnv,
      REPLAY_RATE: '7',
    };

    parserImplementation = parser;
    const { detectScreenReader, detectPlainOutput, getReplayRate } = await import('../../src/ux/detectScreenReader.js?flags');

    assert.strictEqual(detectScreenReader(), true);
    assert.strictEqual(detectPlainOutput(), true);
    assert.strictEqual(getReplayRate(), 9000);
  });
});

test('UX: spinner', async (ctx) => {
  let hideCursor;
  let resetCursor;
  let overwriteLine;
  let overwriteWithNewLine;
  let detectPlainOutput;
  let getReplayRate;
  let truncateToTerminal;

  ctx.mock.module('../../src/ux/cursor.js', {
    namedExports: {
      hideCursor: (...args) => hideCursor(...args),
      resetCursor: (...args) => resetCursor(...args),
    },
  });
  ctx.mock.module('../../src/ux/clear.js', {
    namedExports: {
      overwriteLine: (...args) => overwriteLine(...args),
      overwriteWithNewLine: (...args) => overwriteWithNewLine(...args),
    },
  });
  ctx.mock.module('../../src/ux/detectScreenReader.js', {
    namedExports: {
      detectPlainOutput: (...args) => detectPlainOutput(...args),
      getReplayRate: (...args) => getReplayRate(...args),
    },
  });
  ctx.mock.module('../../src/ux/truncateToTerminal.js', {
    namedExports: {
      truncateToTerminal: (...args) => truncateToTerminal(...args),
    },
  });

  await ctx.test('Will run a spinner in plain mode', async () => {
    process.stderr.write = mock.fn();
    hideCursor = mock.fn();
    resetCursor = mock.fn();
    overwriteLine = mock.fn();
    overwriteWithNewLine = mock.fn();
    detectPlainOutput = mock.fn(() => true);
    getReplayRate = mock.fn(() => 1000);
    truncateToTerminal = mock.fn((value) => value);
    const { spinner } = await import('../../src/ux/spinner.js?plain');

    const handle = spinner({ message: 'Loading' });
    handle.stop();

    assert.deepStrictEqual(process.stderr.write.mock.calls[0].arguments, ['Loading\n']);
    assert.strictEqual(hideCursor.mock.calls.length, 0);
    assert.deepStrictEqual(overwriteWithNewLine.mock.calls[0].arguments, ['Loading']);
    assert.strictEqual(resetCursor.mock.calls.length, 1);
  });

  await ctx.test('Will run and fail a spinner in interactive mode', async () => {
    process.stderr.write = mock.fn();
    hideCursor = mock.fn();
    resetCursor = mock.fn();
    overwriteLine = mock.fn();
    overwriteWithNewLine = mock.fn();
    detectPlainOutput = mock.fn(() => false);
    getReplayRate = mock.fn(() => 1000);
    truncateToTerminal = mock.fn((value) => value);
    const { spinner } = await import('../../src/ux/spinner.js?interactive');

    const handle = spinner({ message: 'Loading', frames: ['-'], frameRate: 1000 });
    handle.fail('Nope');

    assert.strictEqual(hideCursor.mock.calls.length, 1);
    assert.deepStrictEqual(process.stderr.write.mock.calls[0].arguments, ['- Loading']);
    assert.deepStrictEqual(overwriteWithNewLine.mock.calls[0].arguments, ['Nope']);
    assert.strictEqual(resetCursor.mock.calls.length, 1);
    assert.strictEqual(overwriteLine.mock.calls.length, 0);
  });
});
