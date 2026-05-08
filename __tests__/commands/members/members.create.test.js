import YAML from 'yaml';
import { Client } from '@vonage/server-client';

const confirm = mock.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/members/create.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import {
  getTestMemberForAPI,
  addAppChannelToMember,
  addPhoneChannelToMember,
  addSMSChannelToMember,
  addMMSChannelToMember,
  addWhatsAppChannelToMember,
  addViberChannelToMember,
  addMessengerChannelToMember,
} from '../../members.js';
import { getTestConversationForAPI } from '../../conversations.js';
import { stateLabels } from '../../../src/members/display.js';

describe('Command: vonage members create', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
  });

  test('Will create an app member', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(
      memberMock,
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

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(console.log, JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });

  test('Will create a member and output yaml', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());
    const conversation = getTestConversationForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

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

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.strictEqual(memberMock.mock.callCount(), 1);

    assertCalledWith(console.log, YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    ));
  });
});
