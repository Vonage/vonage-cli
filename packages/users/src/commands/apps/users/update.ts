import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';
import { ArgInput } from '@oclif/core/lib/interfaces';

interface UpdateFlags {
    name: any
    display_name: any
    image_url: any
}


export default class UsersUpdate extends UserCommand<typeof UsersUpdate.flags> {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> & UpdateFlags = {
        ...UserCommand.flags,
        'name': flags.string({ description: '' }),
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
    }

    static args: ArgInput = [
        { name: 'userID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;


        let response = await this.updateUser({ ...args, ...flags }) as VetchResponse;

        this.log(chalk.magenta.underline.bold("User ID:"), args.userID)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url)
        this.log('')
    }
}