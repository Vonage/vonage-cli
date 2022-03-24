import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';
import { ArgInput } from '@oclif/core/lib/interfaces';


export default class UsersShow extends UserCommand<typeof UsersShow.flags> {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    static args: ArgInput = [
        { name: 'userID', required: false }
    ]

    async run() {
        const args = this.parsedArgs!;

        let response = await this.getUserById(args.userID) as VetchResponse;

        this.log(chalk.magenta.underline.bold("User ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name || ""})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url || "None")
        this.log('')
    }
}