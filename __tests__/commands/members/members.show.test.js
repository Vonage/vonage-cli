process.env.FORCE_COLOR = 0;
const YAML = require('yaml');
const { handler } = require('../../../src/commands/members/show');
const { mockConsole } = require('../../helpers');
const { displayDate } = require('../../../src/ux/date');
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
const { Client } = require('@vonage/server-client');

const {
  stateLabels,
  memberChannelType,
} = require('../../../src/members/display');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage members show', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will show a member with no channel', async () => {
    const member = getTestMemberForAPI();

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'User',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        `  User ID: ${member.user.id}`,
        `  Name: ${member.user.name}`,
        `  Display Name: ${member.user.displayName}`,
      ].join('\n'),
    );

    expect(console.log).toHaveBeenNthCalledWith(
      6,
      'Timestamps',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      7,
      [
        `  Invited: ${displayDate(member.timestamp.invited)}`,
        `  Joined: ${displayDate(member.timestamp.joined)}`,
        `  Left: ${displayDate(member.timestamp.left)}`,
      ].join('\n'),
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: Not Set',
        '  Can accept messages from: Not Set',
      ].join('\n'),
    );
  });

  test('Will show a member with app channel', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: Application',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can message user: ${member.channel.to.user}`,
      ].join('\n'),
    );
  });

  test('Will show a member with phone channel', async () => {
    const member = addPhoneChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: Phone',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can call: ${member.channel.to.number}`,
      ].join('\n'),
    );
  });

  test('Will show a member with sms channel', async () => {
    const member = addSMSChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: SMS',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can send SMS messages to: ${member.channel.to.number}`,
      ].join('\n'),
    );
  });

  test('Will show a member with MMS channel', async () => {
    const member = addMMSChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: MMS',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can send MMS messages to: ${member.channel.to.number}`,
      ].join('\n'),
    );
  });

  test('Will show a member with WhatsApp channel', async () => {
    const member = addWhatsAppChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: WhatsApp',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can send WhatsApp messages to: ${member.channel.to.number}`,
      ].join('\n'),
    );
  });

  test('Will show a member with Viber channel', async () => {
    const member = addViberChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: Viber',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can send Viber messages to: ${member.channel.to.id}`,
      ].join('\n'),
    );
  });

  test('Will show a member with Messenger channel', async () => {
    const member = addMessengerChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      9,
      'Channel',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      10,
      [
        '  Channel Type: Messenger',
        `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
        `  Can send Messenger messages to: ${member.channel.to.id}`,
      ].join('\n'),
    );
  });

  test('Will output JSON', async () => {
    const member = addMessengerChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
      json: true,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(member, true),
        null,
        2,
      ),
    );
  });

  test('Will output YAML', async () => {
    const member = addMessengerChannelToMember(getTestMemberForAPI());

    const memberMock = jest.fn()
      .mockResolvedValueOnce(member);

    const sdkMock = {
      conversations: {
        getMember: memberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      memberId: member.id,
      conversationId: member.conversationId,
      yaml: true,
    });

    expect(memberMock).toHaveBeenCalledWith(
      member.conversationId,
      member.id,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      YAML.stringify(
        Client.transformers.snakeCaseObjectKeys(member, true),
        null,
        2,
      ),
    );
  });
});

