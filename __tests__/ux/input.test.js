import { jest } from '@jest/globals';
import { inputFromTTY } from '../../src/ux/input.js';
import readline from 'readline';

jest.mock('readline');
jest.useFakeTimers();

describe('UX: input tests', () => {
  setTimeout(() => readline.__inputMock.emit('keypress', 'f', {name: 'f'}), 10);
  test('Will capture printable keys', async () => {
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 11);
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 12);
    setTimeout(() => readline.__inputMock.emit('keypress', '\r', {name: 'return'}), 20);
    const input = inputFromTTY({});
    jest.advanceTimersByTime(100);
    const result = await Promise.resolve(input);
    expect(result).toBe('foo');
  });

  test('Will delete characters with delete key', async () => {
    setTimeout(() => readline.__inputMock.emit('keypress', 'f', {name: 'f'}), 10);
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 11);
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 12);
    setTimeout(() => readline.__inputMock.emit('keypress', '', {name: 'delete'}), 13);
    setTimeout(() => readline.__inputMock.emit('keypress', '\r', {name: 'return'}), 20);
    const input = inputFromTTY({});
    jest.advanceTimersByTime(100);
    const result = await Promise.resolve(input);
    expect(result).toBe('fo');
  });

  test('Will delete characters with backspace key', async () => {
    setTimeout(() => readline.__inputMock.emit('keypress', 'f', {name: 'f'}), 10);
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 11);
    setTimeout(() => readline.__inputMock.emit('keypress', 'o', {name: 'o'}), 12);
    setTimeout(() => readline.__inputMock.emit('keypress', '', {name: 'backspace'}), 13);
    setTimeout(() => readline.__inputMock.emit('keypress', '\r', {name: 'return'}), 20);
    const input = inputFromTTY({});
    jest.advanceTimersByTime(100);
    const result = await Promise.resolve(input);
    expect(result).toBe('fo');
  });
});
