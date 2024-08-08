const log = console.log; // save original console.log function
const info = console.info;
const debug = console.debug;
const error = console.error;

afterAll(() => {
  console.log = log;
  console.info = info;
  console.debug = debug;
  console.error = error;
});

exports.mockConsole = () => {

  console.log = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
  console.error = jest.fn();
  return console;
};
