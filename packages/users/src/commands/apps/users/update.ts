import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import cli from 'cli-ux';
import chalk from 'chalk';

interface UpdateFlags {
    name: any
    display_name: any
    image_url: any
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
        ...UserCommand.args,
        { name: 'userID', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;


        let response = await this.updateUser({ ...args, ...flags });

        this.log(chalk.magenta.underline.bold("User ID:"), args.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), apiresponse.name, `(${apiresponse.display_name})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), apiresponse.image_url)
        this.log('')
    }
}

// requires id
const apiresponse = {
    "name": "my_user_name",
    "display_name": "My User Name",
    "image_url": "https://example.com/image.png",
    "channels": {
        "type": "phone",
        "leg_id": "a595959595959595995",
        "from": "string",
        "to": "string",
        "leg_ids": [
            {
                "leg_id": "a595959595959595995"
            }
        ]
    }
}