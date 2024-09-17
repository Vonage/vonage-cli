const { confirm } = require('../../src/ux/confirm');
const readline = require('readline');

jest.mock('readline');

describe('UX: confirm', () => {
  test('Will conrim the message', async () => {
    readline.__questionMock.mockImplementation((question, callback) => {
      callback('y');
    });

    const result = await confirm('Are you sure?');
    expect(result).toBe(true);
    expect(readline.__questionMock).toHaveBeenCalledWith('Are you sure? [y/n] ', expect.any(Function));
    expect(readline.__closeMock).toHaveBeenCalled();
  });
});
