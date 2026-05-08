import YAML from 'yaml';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const confirm = mock.fn();

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/members/show.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { displayDate } from '../../../src/ux/locale.js';
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
import { stateLabels, memberChannelType } from '../../../src/members/display.js';

describe('Command: vonage members show', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will show a member with no channel', async () => {
    const member = getTestMemberForAPI();

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(
      console.log,
      1,
      [
        `Member ID: ${member.id}`,
        `State: ${stateLabels[member.state]}`,
        `Knocking Id: ${member.knockingId}`,
        `Invited by: ${member.memberIdInviting}`,
      ].join('\n'),
    );

    assertNthCalledWith(console.log, 3, 'User');

    assertNthCalledWith(
      console.log,
      4,
      [
        `  User ID: ${member.user.id}`,
        `  Name: ${member.user.name}`,
        `  Display Name: ${member.user.displayName}`,
      ].join('\n'),
    );

    assertNthCalledWith(console.log, 6, 'Timestamps');

    assertNthCalledWith(
      console.log,
      7,
      [
        `  Invited: ${displayDate(member.timestamp.invited)}`,
        `  Joined: ${displayDate(member.timestamp.joined)}`,
        `  Left: ${displayDate(member.timestamp.left)}`,
      ].join('\n'),
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
      10,
      [
        '  Channel Type: Not Set',
        '  Can accept messages from: Not Set',
      ].join('\n'),
    );
  });

  test('Will show a member with app channel', async () => {
    const member = addAppChannelToMember(getTestMemberForAPI());

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(console.log, 9, 'Channel');

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(
      console.log,
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

    const memberMock = mock.fn();
    memberMock.mock.mockImplementationOnce(() => Promise.resolve(member));

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

    assertCalledWith(
      memberMock,
      member.conversationId,
      member.id,
    );

    assertNthCalledWith(
      console.log,
      1,
      YAML.stringify(
        Client.transformers.snakeCaseObjectKeys(member, true),
        null,
        2,
      ),
    );
  });
});
