import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../../conversations_base.js';
import { Flags, CliUx } from '@oclif/core';

const cli = CliUx.ux;

export default class ConversationMemberDefault extends ConversationCommand<
    typeof ConversationMemberDefault.flags
> {
    static description = 'View all members in a conversation';

    static examples = [];

    static flags = {
        ...ConversationCommand.flags,
        page_size: Flags.string({ description: '', hidden: true }),
        order: Flags.string({ description: '', hidden: true }),
        cursor: Flags.string({ description: '', hidden: true }),
    };

    static args: ArgInput = [{ name: 'conversationID', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;

        const response = await this.getAllMembersInConversation({
            ...args,
            ...flags,
        });

        const membersList = response.data._embedded.members;

        cli.table(
            membersList,
            {
                id: {},
                state: {},
            },
            {
                ...flags,
            },
        );

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}
