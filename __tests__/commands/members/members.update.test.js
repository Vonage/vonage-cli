process.env.FORCE_COLOR = 0;
const YAML = require('yaml');
const { faker } = require('@faker-js/faker');
const yargs = require('yargs');
const { handler } = require('../../../src/commands/members/update');
const { mockConsole } = require('../../helpers');
const {
  getTestMemberForAPI,
} = require('../../members');
const { getTestConversationForAPI } = require('../../conversations');
const { Client } = require('@vonage/server-client');

jest.mock('yargs');

describe('Command: vonage members create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will update a member without reason', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const updateMemberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(updateMemberMock).toHaveBeenCalledWith(
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

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const updateMemberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
        getConversation: conversationMock,
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

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(updateMemberMock).toHaveBeenCalledWith(
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

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const updateMemberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
        getConversation: conversationMock,
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

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(updateMemberMock).toHaveBeenCalledWith(
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

    expect(console.log).toHaveBeenCalledWith(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });

  test('Will update a member and return yaml', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const updateMemberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
        getConversation: conversationMock,
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

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(updateMemberMock).toHaveBeenCalledWith(
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

    expect(console.log).toHaveBeenCalledWith(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });

  test('Will handle error when udpating fails', async () => {
    const member = getTestMemberForAPI();
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);


    const error = new Error('Failed to update member');
    const updateMemberMock = jest.fn()
      .mockRejectedValueOnce(error);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
        updateMember: updateMemberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      memberId: member.id,
      state: 'joined',
      from: member.from,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);
    expect(updateMemberMock).toHaveBeenCalledTimes(1);
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
