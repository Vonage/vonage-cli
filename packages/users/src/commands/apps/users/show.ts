import UserCommand from '../../../users_base.js';
import chalk from 'chalk';
import { VetchResponse } from '../../../types.js';
import { ArgInput, OutputFlags } from '@oclif/core/lib/interfaces';

export default class UsersShow extends UserCommand<typeof UsersShow.flags> {
    static description = '';

    static examples = [];

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags,
    };

    static args: ArgInput = [{ name: 'userID', required: false }];

    async run() {
        const args = this.parsedArgs!;

        const response = (await this.getUserById(args.userID)) as VetchResponse;

        this.log(chalk.magenta.underline.bold('User ID:'), response.data.id);
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Name:'),
            response.data.name,
            `(${response.data.display_name || ''})`,
        );
        this.log('');
        this.log(
            chalk.magenta.underline.bold('Image Url:'),
            response.data.image_url || 'None',
        );
        this.log('');
    }
}
