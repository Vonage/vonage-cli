import { OutputFlags } from '@oclif/parser';
import chalk from 'chalk';
import ConversationCommand from '../../../../conversations_base';

export default class ConversationMemberShow extends ConversationCommand {
    static description = "Show specific member"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> = {
        ...ConversationCommand.flags
    }

    static args = [
        ...ConversationCommand.args,
        { name: 'conversationID', required: false },
        { name: 'memberID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        let response = await this.getMemberById({ ...args, ...flags });

        this.log(chalk.magenta.underline.bold("Member ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("User ID:"), response.data._embedded.user.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("User Name:"), response.data._embedded.user.name)
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
    }
}