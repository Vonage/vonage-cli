const EventEmitter = require('node:events');
afterEach(() => {
  jest.clearAllMocks();
});

const readline = jest.createMockFromModule('readline');
const questionMock = jest.fn();
const emitKeypressEventsMock = jest.fn();
const rlOn = jest.fn();
const rlOff = jest.fn();

const inputMock = new EventEmitter();

const closeMock = jest.fn().mockImplementation(() => undefined);

const createInterface = jest.fn().mockReturnValue({
  question: questionMock,
  close: closeMock,
  emitKeypressEvents: emitKeypressEventsMock,
  input: inputMock,
  on: rlOn,
  off: rlOff,
});

readline.createInterface = createInterface;
readline.emitKeypressEvents = emitKeypressEventsMock;
readline.input = inputMock;

readline.__questionMock = questionMock;
readline.__closeMock = closeMock;
readline.__createInterfaceMock = createInterface;
readline.__inputMock = inputMock;
readline.__rlOn = rlOn;
readline.__rlOff = rlOff;

module.exports = readline;
