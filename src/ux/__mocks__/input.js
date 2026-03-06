import { jest, afterEach } from '@jest/globals';

afterEach(() => {
  jest.clearAllMocks();
});

export const inputFromTTY = jest.fn();
