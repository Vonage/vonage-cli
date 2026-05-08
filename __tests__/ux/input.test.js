import EventEmitter from 'node:events';
import { mockConsole } from '../helpers.js';

describe('UX: input tests', () => {
  const questionMock = mock.fn();
  const emitKeypressEventsMock = mock.fn();
  const rlOn = mock.fn();
  const rlOff = mock.fn();
  const readline = {};

  const inputMock = new EventEmitter();

  const closeMock = mock.fn(() => undefined);

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

  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    questionMock.mock.resetCalls();
    emitKeypressEventsMock.mock.resetCalls();
    rlOn.mock.resetCalls();
    rlOff.mock.resetCalls();
    closeMock.mock.resetCalls();
    createInterface.mock.resetCalls();
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

    const result = await input;

    assert.strictEqual(result, 'foo');
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

    const result = await input;

    assert.strictEqual(result, 'fo');
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

    const result = await input;
    assert.strictEqual(result, 'fo');
  });
});
