import { ArgInput } from '@oclif/core/lib/interfaces';
import chalk from 'chalk';
import ConversationCommand from '../../../../conversations_base';


export default class ConversationMemberRemove extends ConversationCommand<typeof ConversationMemberRemove.flags> {
    static description = "Remove a user from a conversation"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags
    }

    static args: ArgInput = [
        { name: 'conversationID', required: false },
        { name: 'memberID', required: false }
    ]

    async run() {
        const args = this.parsedArgs!;

        await this.removeMemberFromConversation(args);

        this.log(`Member ${chalk.bold(args.memberID)} removed from Conversation ${chalk.bold(args.conversationID)}.`)
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}