import EventEmitter from 'node:events';
import { mockConsole } from '../helpers.js';

jest.useFakeTimers();

describe('UX: input tests', () => {
  const questionMock = jest.fn();
  const emitKeypressEventsMock = jest.fn();
  const rlOn = jest.fn();
  const rlOff = jest.fn();
  const readline = jest.createMockFromModule('readline');

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

  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  test('Will capture printable keys', async () => {

    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const { inputFromTTY } = await loadModule(
      import.meta.url,
      '../../src/ux/input.js',
      { 'readline': { default: readline } },
    );

    const input = inputFromTTY({});

    jest.advanceTimersByTime(100);


    const result = await Promise.resolve(input);

    expect(result).toBe('foo');
  });

  test('Will delete characters with delete key', async () => {

    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '', { name: 'delete' }), 13);

    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const { inputFromTTY } = await loadModule(
      import.meta.url,
      '../../src/ux/input.js',
      { 'readline': { default: readline } },
    );
    const input = inputFromTTY({});

    jest.advanceTimersByTime(100);

    const result = await Promise.resolve(input);

    expect(result).toBe('fo');
  });

  test('Will delete characters with backspace key', async () => {
    setTimeout(() => inputMock.emit('keypress', 'f', { name: 'f' }), 10);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 11);
    setTimeout(() => inputMock.emit('keypress', 'o', { name: 'o' }), 12);
    setTimeout(() => inputMock.emit('keypress', '', { name: 'backspace' }), 13);
    setTimeout(() => inputMock.emit('keypress', '\r', { name: 'return' }), 20);

    const { inputFromTTY } = await loadModule(
      import.meta.url,
      '../../src/ux/input.js',
      { 'readline': { default: readline } },
    );
    const input = inputFromTTY({});

    jest.advanceTimersByTime(100);

    const result = await Promise.resolve(input);
    expect(result).toBe('fo');
  });
});
