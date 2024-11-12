const { confirm } = require('../../src/ux/confirm');
const readline = require('readline');

jest.mock('readline');

describe('UX: confirm', () => {
  test('Will confrim the message with y', async () => {
    readline.__questionMock.mockImplementation((question, callback) => {
      callback('y');
    });

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(readline.__questionMock).toHaveBeenCalledWith('Are you sure? [y/n] ', expect.any(Function));
    expect(readline.__closeMock).toHaveBeenCalledTimes(1);
  });

  test('Will confrim the message with n', async () => {
    readline.__questionMock.mockImplementation((question, callback) => {
      callback('n');
    });

    const result = await confirm('Are you sure?');
    expect(result).toBe(false);
    expect(readline.__questionMock).toHaveBeenCalledWith('Are you sure? [y/n] ', expect.any(Function));
    expect(readline.__closeMock).toHaveBeenCalledTimes(1);
  });

  test('Will keep asking with invalid input message', async () => {
    readline.__questionMock
      .mockImplementationOnce((question, callback) => {
        callback('foo');
      })
      .mockImplementationOnce((question, callback) => {
        callback('y');
      });

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(readline.__questionMock).toHaveBeenNthCalledWith(1, 'Are you sure? [y/n] ', expect.any(Function));
    expect(readline.__questionMock).toHaveBeenNthCalledWith(2, 'Are you sure? [y/n] ', expect.any(Function));
    expect(readline.__closeMock).toHaveBeenCalledTimes(2);
  });
});
