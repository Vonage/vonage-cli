import { jest, afterEach } from '@jest/globals';

afterEach(() => {
  jest.clearAllMocks();
});

export const confirm = jest.fn();
