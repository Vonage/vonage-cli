import { OutputFlags } from '@oclif/parser';
import ConversationCommand from '../../../conversations_base';
import chalk from 'chalk';

export default class ConversationDelete extends ConversationCommand {
    static description = "Delete a conversation"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
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