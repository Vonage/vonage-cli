import { flags } from '@oclif/command';
import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../../conversations_base';
import cli from 'cli-ux';



export default class ConversationMemberDefault extends ConversationCommand<typeof ConversationMemberDefault.flags> {
    static description = "View all members in a conversation"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags,
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
    }

    static args: ArgInput = [
        { name: 'conversationID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getAllMembersInConversation({ ...args, ...flags });

        let membersList = response.data._embedded.members;

        cli.table(membersList, {
            id: {},
            state: {},
        }, {
            ...flags
        })

        this.exit();
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}