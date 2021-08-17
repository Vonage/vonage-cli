import { OutputFlags } from '@oclif/parser';
import cli from 'cli-ux';
import chalk from 'chalk';
import ConversationCommand from '../../../../conversations_base';

export default class ConversationMemberAdd extends ConversationCommand {
    static description = "Add user to conversation"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
        ...ConversationCommand.args,
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
}