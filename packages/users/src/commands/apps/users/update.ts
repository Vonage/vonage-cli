import { OutputArgs, OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

interface UpdateFlags {
    name: any
    display_name: any
    image_url: any
}

interface UpdateArgs extends OutputArgs<any> {
    userID: string,
}

export default class UsersUpdate extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> & UpdateFlags = {
        ...UserCommand.flags,
        'name': flags.string({ description: '' }),
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
    }

    static args = [
        { name: 'userID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs! as UpdateArgs;


        let response = await this.updateUser({ ...args, ...flags }) as VetchResponse;

        this.log(chalk.magenta.underline.bold("User ID:"), args.userID)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url)
        this.log('')
    }
}