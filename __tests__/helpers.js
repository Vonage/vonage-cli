import { mock } from 'node:test';

const originalConsole = {
  log: console.log,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  error: console.error,
  table: console.table,
};

const originalStdoutWrite = process.stdout.write;
const originalStderrWrite = process.stderr.write;

afterEach(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
  console.error = originalConsole.error;
  console.table = originalConsole.table;
  process.stdout.write = originalStdoutWrite;
  process.stderr.write = originalStderrWrite;
});

export const mockConsole = () => {
  console.log = mock.fn();
  console.warn = mock.fn();
  console.info = mock.fn();
  console.debug = mock.fn();
  console.error = mock.fn();
  console.table = mock.fn();
  process.stdout.clearLine = mock.fn();
  process.stderr.clearLine = mock.fn();
  process.stdout.write = mock.fn();
  process.stderr.write = mock.fn();
  return console;
};
