import chalk from 'chalk';
import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../../conversations_base';


export default class ConversationMemberShow extends ConversationCommand<typeof ConversationMemberShow.flags> {
    static description = "Show specific member"

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

    async catch(error: any) {
        return super.catch(error.response);
    }
}