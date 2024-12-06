process.env.FORCE_COLOR = 0;
const { handler } = require('../../../src/commands/members/list');
const { mockConsole } = require('../../helpers');
const { confirm } = require('../../../src/ux/confirm');
const {
  getTestMemberForAPI,
} = require('../../members');

const {
  stateLabels,
} = require('../../../src/members/display');

jest.mock('../../../src/ux/confirm');

describe('Command: vonage members list', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will show one page of members', async () => {
    const member = getTestMemberForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce({
        members: [member],
      });

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(confirm).not.toHaveBeenCalled();

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    expect(console.table).toHaveBeenNthCalledWith(
      1,
      [
        {
          'Member ID': member.id,
          'State': stateLabels[member.state],
        },
      ],
    );
  });

  test('Will handle no members', async () => {
    const member = getTestMemberForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce({
        members: [],
      });

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledTimes(1);
    expect(console.table).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    expect(console.log).toHaveBeenCalledWith(
      'No members found for this conversation.',
    );
  });

  test('Will show two page of members', async () => {
    const memberOne = getTestMemberForAPI();
    const memberTwo = getTestMemberForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce({
        members: [memberOne],
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations/CON-123/members?cursor=CUR-123',
          },
        },
      })
      .mockResolvedValueOnce({
        members: [memberTwo],
      });

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    confirm.mockResolvedValue(true);

    await handler({
      SDK: sdkMock,
      conversationId: memberOne.conversationId,
    });

    expect(memberMock).toHaveBeenCalledTimes(2);
    expect(console.table).toHaveBeenCalledTimes(2);
    expect(confirm).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      memberOne.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    expect(confirm).toHaveBeenCalledWith(
      'There are more members. Do you want to continue?',
    );

    expect(console.table).toHaveBeenNthCalledWith(
      1,
      [
        {
          'Member ID': memberOne.id,
          'State': stateLabels[memberOne.state],
        },
      ],
    );

    expect(console.table).toHaveBeenNthCalledWith(
      2,
      [
        {
          'Member ID': memberTwo.id,
          'State': stateLabels[memberTwo.state],
        },
      ],
    );
  });

  test('Will show one page of members when user declines next page', async () => {
    const memberOne = getTestMemberForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce({
        members: [memberOne],
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations/CON-123/members?cursor=CUR-123',
          },
        },
      });

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    confirm.mockResolvedValue(false);

    await handler({
      SDK: sdkMock,
      conversationId: memberOne.conversationId,
    });

    expect(memberMock).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      memberOne.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    expect(console.table).toHaveBeenNthCalledWith(
      1,
      [
        {
          'Member ID': memberOne.id,
          'State': stateLabels[memberOne.state],
        },
      ],
    );
  });
});

