process.env.FORCE_COLOR = 0;
const YAML = require('yaml');
const { handler } = require('../../../src/commands/members/create');
const { mockConsole } = require('../../helpers');
const {
  getTestMemberForAPI,
  addAppChannelToMember,
  addPhoneChannelToMember,
  addSMSChannelToMember,
  addMMSChannelToMember,
  addWhatsAppChannelToMember,
  addViberChannelToMember,
  addMessengerChannelToMember,
} = require('../../members');
const { getTestConversationForAPI } = require('../../conversations');
const { Client } = require('@vonage/server-client');

const {
  stateLabels,
} = require('../../../src/members/display');

jest.mock('../../../src/ux/confirm');

describe('Command: vonage members create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will create an app member', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToUser: member.channel.to.user,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: member.media.audioSettings.enabled,
      audioEarmuffed: member.media.audioSettings.earmuffed,
      audioMuted: member.media.audioSettings.muted,
      audio: member.media.audio,
      knockingId: member.knockingId,
      memberIdInviting: member.memberIdInviting,
      fromMemberId: member.from,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: member.media,
        knockingId: member.knockingId,
        memberIdInviting: member.memberIdInviting,
        from: member.from,
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create a phone member', async () => {
    const member = addPhoneChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToPhone: member.channel.to.number,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create an SMS member', async () => {
    const member = addSMSChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToSms: member.channel.to.number,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create an MMS member', async () => {
    const member = addMMSChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToMms: member.channel.to.number,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create a WhatsApp member', async () => {
    const member = addWhatsAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToWhatsapp: member.channel.to.number,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create a Viber member', async () => {
    const member = addViberChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToViber: member.channel.to.id,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create a Messenger member', async () => {
    const member = addMessengerChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToMessenger: member.channel.to.id,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: false,
      audioEarmuffed: false,
      audioMuted: false,
      audio: false,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(memberMock).toHaveBeenCalledWith(
      conversation.id,
      {
        state: member.state,
        user: {
          id: member.user.id,
        },
        channel: member.channel,
        media: {
          audioSettings: {
            enabled: false,
            earmuffed: false,
            muted: false,
          },
          audio: false,
        },
      },
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );
  });

  test('Will create a member and output json', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToUser: member.channel.to.user,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: member.media.audioSettings.enabled,
      audioEarmuffed: member.media.audioSettings.earmuffed,
      audioMuted: member.media.audioSettings.muted,
      audio: member.media.audio,
      knockingId: member.knockingId,
      memberIdInviting: member.memberIdInviting,
      fromMemberId: member.from,
      json: true,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(console.log).toHaveBeenCalledWith(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });

  test('Will create a member and output yaml', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const sdkMock = {
      conversations: {
        createMember: memberMock,
        getConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      conversationId: conversation.id,
      state: member.state,
      userId: member.user.id,
      channelToUser: member.channel.to.user,
      channelFromType: member.channel.from.type.split(','),
      audioEnabled: member.media.audioSettings.enabled,
      audioEarmuffed: member.media.audioSettings.earmuffed,
      audioMuted: member.media.audioSettings.muted,
      audio: member.media.audio,
      knockingId: member.knockingId,
      memberIdInviting: member.memberIdInviting,
      fromMemberId: member.from,
      yaml: true,
    });

    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(memberMock).toHaveBeenCalledTimes(1);

    expect(console.log).toHaveBeenCalledWith(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });
});
