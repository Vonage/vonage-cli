const confirm = mock.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/members/list.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestMemberForAPI } from '../../members.js';
import { stateLabels } from '../../../src/members/display.js';

describe('Command: vonage members list', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
  });

  test('Will show one page of members', async () => {
    const member = getTestMemberForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve({
      members: [member],
    }));

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: member.conversationId,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);
    assert.strictEqual(console.table.mock.callCount(), 1);
    assert.strictEqual(confirm.mock.callCount(), 0);

    assertCalledWith(
      memberMock,
      member.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    assertNthCalledWith(
      console.table,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve({
      members: [],
    }));

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: member.conversationId,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);
    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.strictEqual(confirm.mock.callCount(), 0);

    assertCalledWith(
      memberMock,
      member.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    assertCalledWith(
      console.log,
      'No members found for this conversation.',
    );
  });

  test('Will show two page of members', async () => {
    const memberOne = getTestMemberForAPI();
    const memberTwo = getTestMemberForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve({
      members: [memberOne],
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations/CON-123/members?cursor=CUR-123',
        },
      },
    }));
    memberMock.mock.mockImplementationOnce(() => Promise.resolve({
      members: [memberTwo],
    }));

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    confirm.mock.mockImplementation(() => Promise.resolve(true));

    await handler({
      SDK: sdkMock,
      conversationId: memberOne.conversationId,
    });

    assert.strictEqual(memberMock.mock.callCount(), 2);
    assert.strictEqual(console.table.mock.callCount(), 2);
    assert.strictEqual(confirm.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
      memberOne.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    assertCalledWith(
      confirm,
      'There are more members. Do you want to continue?',
    );

    assertNthCalledWith(
      console.table,
      1,
      [
        {
          'Member ID': memberOne.id,
          'State': stateLabels[memberOne.state],
        },
      ],
    );

    assertNthCalledWith(
      console.table,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve({
      members: [memberOne],
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations/CON-123/members?cursor=CUR-123',
        },
      },
    }));

    const sdkMock = {
      conversations: {
        getMemberPage: memberMock,
      },
    };

    confirm.mock.mockImplementation(() => Promise.resolve(false));

    await handler({
      SDK: sdkMock,
      conversationId: memberOne.conversationId,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);
    assert.strictEqual(console.table.mock.callCount(), 1);
    assert.strictEqual(confirm.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
      memberOne.conversationId,
      {
        cursor: undefined,
        pageSize: undefined,
      },
    );

    assertNthCalledWith(
      console.table,
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
