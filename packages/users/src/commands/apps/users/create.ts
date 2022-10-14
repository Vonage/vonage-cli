import { CliUx, Flags } from '@oclif/core';
import { OutputFlags, ArgInput } from '@oclif/core/lib/interfaces';
import UserCommand from '../../../users_base.js';
import chalk from 'chalk';
import { VetchResponse } from '../../../types.js';

const cli = CliUx.ux;

interface CreateFlags {
    display_name: any;
    image_url: any;
}

export default class UsersCreate extends UserCommand<typeof UsersCreate.flags> {
    static description = '';

    static examples = [];

    static flags: OutputFlags<typeof UserCommand.flags> & CreateFlags = {
        ...UserCommand.flags,
        display_name: Flags.string({ description: '' }),
        image_url: Flags.string({ description: '' }),
    };

    static args: ArgInput = [{ name: 'name', required: false }];

    async run() {
        const flags = this.parsedFlags;
        const args = this.parsedArgs!;

        // check for name

        cli.action.start(chalk.bold('Creating User'), 'Initializing', {
            stdout: true,
        });

        const response = (await this.createUser({
            ...flags,
            ...args,
        })) as VetchResponse;

        cli.action.stop();

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
