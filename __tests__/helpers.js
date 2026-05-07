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
  console.log = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
  console.error = jest.fn();
  console.table = jest.fn();
  process.stdout.clearLine = jest.fn();
  process.stderr.clearLine = jest.fn();
  process.stdout.write = jest.fn();
  process.stderr.write = jest.fn();
  return console;
};
