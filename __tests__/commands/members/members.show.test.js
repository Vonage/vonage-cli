import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import YAML from 'yaml';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const confirm = mock.fn();



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

test('Command: vonage members show', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });
  const { handler } = await import('../../../src/commands/members/show.js');
  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will show a member with no channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [[
      `Member ID: ${member.id}`,
      `State: ${stateLabels[member.state]}`,
      `Knocking Id: ${member.knockingId}`,
      `Invited by: ${member.memberIdInviting}`,
    ].join('\n')]);

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['User']);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      `  User ID: ${member.user.id}`,
      `  Name: ${member.user.name}`,
      `  Display Name: ${member.user.displayName}`,
    ].join('\n')]);

    assert.deepStrictEqual(console.log.mock.calls[6 - 1].arguments, ['Timestamps']);

    assert.deepStrictEqual(console.log.mock.calls[7 - 1].arguments, [[
      `  Invited: ${displayDate(member.timestamp.invited)}`,
      `  Joined: ${displayDate(member.timestamp.joined)}`,
      `  Left: ${displayDate(member.timestamp.left)}`,
    ].join('\n')]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: Not Set',
      '  Can accept messages from: Not Set',
    ].join('\n')]);
  });

  await ctx.test('Will show a member with app channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: Application',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can message user: ${member.channel.to.user}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with phone channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: Phone',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can call: ${member.channel.to.number}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with sms channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: SMS',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can send SMS messages to: ${member.channel.to.number}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with MMS channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: MMS',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can send MMS messages to: ${member.channel.to.number}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with WhatsApp channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: WhatsApp',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can send WhatsApp messages to: ${member.channel.to.number}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with Viber channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: Viber',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can send Viber messages to: ${member.channel.to.id}`,
    ].join('\n')]);
  });

  await ctx.test('Will show a member with Messenger channel', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Channel']);

    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, [[
      '  Channel Type: Messenger',
      `  Can accept messages from: ${memberChannelType(member.channel.from)}`,
      `  Can send Messenger messages to: ${member.channel.to.id}`,
    ].join('\n')]);
  });

  await ctx.test('Will output JSON', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    )]);
  });

  await ctx.test('Will output YAML', async () => {
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

    assert.deepStrictEqual(memberMock.mock.calls[0].arguments, [member.conversationId, member.id]);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(member, true),
      null,
      2,
    )]);
  });
});
