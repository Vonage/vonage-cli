const log = console.log; // save original console.log function
const info = console.info;
const debug = console.debug;
const error = console.error;
const warn = console.warn;
const table = console.table;
const stdout = process.stdout.write;
const stderr = process.stderr.write;

const restoreConsole = () => {
  console.log = log;
  console.info = info;
  console.debug = debug;
  console.error = error;
  console.warn = warn;
  console.table = table;
  process.stdout.write = stdout;
  process.stderr.write = stderr;
};

afterAll(restoreConsole);

exports.restoreConsole = restoreConsole;

exports.mockConsole = () => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
  console.error = jest.fn();
  console.table = jest.fn();
  process.stdout.write = jest.fn();
  process.stderr.write = jest.fn();
  return console;
};
