const { handler } = require('../../../src/commands/apps/delete');
const { faker } = require('@faker-js/faker');
const { sdkError } = require('../../../src/utils/sdkError');
const { mockConsole } = require('../../helpers');

jest.mock('../../../src/utils/sdkError');

describe('Command: vonage apps delete', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Should delete app', async () => {
    const appMock = jest.fn().mockResolvedValue(undefined);
    const sdkMock = {
      applications: {
        deleteApplication: appMock,
      },
    };

    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(appId);
    expect(sdkError).not.toHaveBeenCalled();
  });

  test('Should handle SDK error', async () => {
    const error = new Error(faker.lorem.sentence());
    const appMock = jest.fn().mockRejectedValue(error);
    const sdkMock = {
      applications: {
        deleteApplication: appMock,
      },
    };

    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(appId);
    expect(sdkError).toHaveBeenCalledWith(error);
  });
});

