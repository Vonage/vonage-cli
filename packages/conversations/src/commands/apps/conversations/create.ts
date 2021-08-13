import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import ConversationCommand from '../../../conversations_base';
import cli from 'cli-ux';
import chalk from 'chalk';

interface CreateFlags {
    display_name: any
    image_url: any
    ttl: any
}

export default class ConversationCreate extends ConversationCommand {
    static description = "Create conversations"

    static examples = [
    ]

    static flags: OutputFlags<typeof ConversationCommand.flags> & CreateFlags = {
        ...ConversationCommand.flags,
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
        'ttl': flags.string({ description: '' }),

    }

    static args = [
        ...ConversationCommand.args,
        { name: 'name', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;


        cli.action.start(chalk.bold('Creating Conversation'), 'Initializing', { stdout: true })

        let response = await this.createConversation({ ...flags, ...args });

        cli.action.stop()

        this.log(chalk.magenta.underline.bold("User ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name || ""})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url || "None")
        this.log('')
        this.log(chalk.magenta.underline.bold("State:"), response.data.state)
        this.log('')
        this.log(chalk.magenta.underline.bold("Created:"), response.data.timestamp.created) // use moment here
        this.log('')
        // this.log(chalk.magenta.underline.bold("TTL:"), response.data.properties.ttl, `(minutes remaining)`) // use moment here to get time remaining if > 0
        // this.log('')
    }
}