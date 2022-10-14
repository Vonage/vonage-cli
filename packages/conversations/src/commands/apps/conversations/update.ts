import { Flags } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import ConversationCommand from '../../../conversations_base.js';
import chalk from 'chalk';

export default class UserConversations extends ConversationCommand<
    typeof UserConversations.flags
> {
    static description = 'Modify a conversation';

    static examples = [];

    static flags = {
        ...ConversationCommand.flags,
        name: Flags.string({ description: '' }),
        display_name: Flags.string({ description: '' }),
        image_url: Flags.string({ description: '' }),
        ttl: Flags.string({ description: '' }),
    };

    static args: ArgInput = [{ name: 'conversationID', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;

        const response = await this.updateConversation({ ...args, ...flags });

        this.log(
            chalk.magenta.underline.bold('Conversation Display Name:'),
            response.data.name,
            `(${response.data.display_name || `''`})`,
        );
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Conversation ID:'),
            response.data.id,
        );
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Image Url:'),
            `'${response.data.image_url}'` || `'None'`,
        );
        this.log('');
        this.log(chalk.magenta.underline.bold('State:'), response.data.state);
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Sequence Number:'),
            response.data.sequence_number,
        );
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Created:'),
            response.data.timestamp.created,
        );
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Time to Live:'),
            response.data.properties.ttl,
        );
        this.log('');
    }

    async catch(error: any) {
        console.log(error);
        return super.catch(error.response);
    }
}
