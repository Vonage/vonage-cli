import cli from 'cli-ux';
import chalk from 'chalk';
import ConversationCommand from '../../../../conversations_base';
import { ArgInput } from '@oclif/core/lib/interfaces';

export default class ConversationMemberAdd extends ConversationCommand<typeof ConversationMemberAdd.flags> {
    static description = "Add user to conversation"

    static examples = [
    ]

    static flags = {
        ...ConversationCommand.flags
    }

    static args: ArgInput = [
        { name: 'conversationID', required: false },
        { name: 'userID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        cli.action.start(chalk.bold('Adding member'), 'Initializing', { stdout: true })

        let response = await this.addMemberToConversation({ ...args, ...flags });

        cli.action.stop()

        this.log(chalk.magenta.underline.bold("Member ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
    }

    async catch(error: any) {
        return super.catch(error.response);
    }
}