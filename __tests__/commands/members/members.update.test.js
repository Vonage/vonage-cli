import YAML from 'yaml';
import { faker } from '@faker-js/faker';
import { handler } from '../../../src/commands/members/update.js';
import { mockConsole } from '../../helpers.js';
import { getTestMemberForAPI } from '../../members.js';
import { getTestConversationForAPI } from '../../conversations.js';
import { Client } from '@vonage/server-client';

describe('Command: vonage members create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will update a member without reason', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const updateMemberMock = mock.fn();
    updateMemberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      updateMemberMock,
      conversation.id,
      member.id,
      {
        state: 'joined',
        reason: {},
      },
    );
  });

  test('Will update a member with reason', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const updateMemberMock = mock.fn();
    updateMemberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
      },
    };

    const reasonCode = faker.number.int(100);
    const reasonText = faker.science.chemicalElement().name;
    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
      from: member.from,
      reasonCode: reasonCode,
      reasonText: reasonText,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      updateMemberMock,
      conversation.id,
      member.id,
      {
        state: 'joined',
        from: member.from,
        reason: {
          code: reasonCode,
          text: reasonText,
        },
      },
    );
  });

  test('Will update a member and return json', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const updateMemberMock = mock.fn();
    updateMemberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
      },
    };

    const reasonCode = faker.number.int(100);
    const reasonText = faker.science.chemicalElement().name;
    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
      from: member.from,
      reasonCode: reasonCode,
      reasonText: reasonText,
      json: true,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      updateMemberMock,
      conversation.id,
      member.id,
      {
        state: 'joined',
        from: member.from,
        reason: {
          code: reasonCode,
          text: reasonText,
        },
      },
    );

    assertCalledWith(
      console.log,
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(member, true),
        null,
        2,
      ),
    );
  });

  test('Will update a member and return yaml', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const updateMemberMock = mock.fn();
    updateMemberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
      },
    };

    const reasonCode = faker.number.int(100);
    const reasonText = faker.science.chemicalElement().name;
    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
      from: member.from,
      reasonCode: reasonCode,
      reasonText: reasonText,
      yaml: true,
    });

    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      updateMemberMock,
      conversation.id,
      member.id,
      {
        state: 'joined',
        from: member.from,
        reason: {
          code: reasonCode,
          text: reasonText,
        },
      },
    );

    assertCalledWith(
      console.log,
      YAML.stringify(
        Client.transformers.snakeCaseObjectKeys(member, true),
        null,
        2,
      ),
    );
  });
});
