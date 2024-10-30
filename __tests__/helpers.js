afterEach(jest.restoreAllMocks);

exports.mockConsole = () => {
  console.log = jest.spyOn(console, 'log');
  console.warn = jest.spyOn(console, 'warn');
  console.info = jest.spyOn(console, 'info');
  console.debug = jest.spyOn(console, 'debug');
  console.error = jest.spyOn(console, 'error');
  console.table = jest.spyOn(console, 'table');
  process.stdout.clearLine = jest.fn();
  process.stderr.clearLine = jest.fn();
  process.stdout.write = jest.fn();
  process.stderr.write = jest.fn();
  return console;
};
