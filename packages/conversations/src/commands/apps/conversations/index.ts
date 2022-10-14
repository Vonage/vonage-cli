import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../conversations_base.js';
import { CliUx, Flags } from '@oclif/core';

const cli = CliUx.ux;

export default class ConversationDefault extends ConversationCommand<
    typeof ConversationDefault.flags
> {
    static description = 'Show all conversations';

    static examples = [];

    static flags = {
        ...ConversationCommand.flags,
        // make defaults
        date_start: Flags.string({ description: '', hidden: true }),
        date_end: Flags.string({ description: '', hidden: true }),
        page_size: Flags.string({ description: '', hidden: true }),
        order: Flags.string({ description: '', hidden: true }),
        cursor: Flags.string({ description: '', hidden: true }),
    };

    static args: ArgInput = [];

    async run() {
        const flags = this.parsedFlags;

        const response = await this.getAllConversations(flags);

        const conversationsList = response.data?._embedded.conversations;

        cli.table(
            conversationsList,
            {
                display_name: {
                    header: 'Display Name',
                    get: (row) => (row ? '' : row),
                },
                id: {
                    header: 'ID',
                },
                name: {},
            },
            {
                ...flags,
            },
        );
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}
