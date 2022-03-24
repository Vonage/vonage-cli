import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';



export default class ConversationDelete extends ConversationCommand<typeof ConversationDelete.flags> {
    static description = "Delete a conversation"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags
    }

    static args: ArgInput = [
        { name: 'conversationID', required: false },
    ]

    async run() {
        const args = this.parsedArgs!;

        // validate proper response
        let response = await this.deleteConversation(args.conversationID);

        if (response.status === 204) {
            this.log(`Conversation ${chalk.bold(args.conversationID)} successfully deleted.`)
        }

    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}