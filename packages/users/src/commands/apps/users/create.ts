import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import cli from 'cli-ux';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

interface CreateFlags {
    display_name: any
    image_url: any
}

export default class UsersCreate extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> & CreateFlags = {
        ...UserCommand.flags,
        'display_name': flags.string({ description: '' }),
        'image_url': flags.string({ description: '' }),
    }

    static args = [
        ...UserCommand.args,
        { name: 'name', required: false }
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs!;

        // check for name

        cli.action.start(chalk.bold('Creating User'), 'Initializing', { stdout: true })

        let response = await this.createUser({ ...flags, ...args }) as VetchResponse;

        cli.action.stop()

        this.log(chalk.magenta.underline.bold("User ID:"), response.data.id)
        this.log('')
        this.log(chalk.magenta.underline.bold("Name:"), response.data.name, `(${response.data.display_name || ""})`)
        this.log('')
        this.log(chalk.magenta.underline.bold("Image Url:"), response.data.image_url || "None")
        this.log('')

    }
}

// response
const apiresponse: any = {
    "id": "USR-82e028d9-5201-4f1e-8188-604b2d3471ec",
    "name": "my_user_name",
    "display_name": "My User Name",
    "image_url": "https://example.com/image.png",
    "properties": {
        "custom_data": {}
    },
    "channels": {},
    "_links": {
        "self": {
            "href": "https://api.nexmo.com/v0.3/users/USR-82e028d9-5201-4f1e-8188-604b2d3471ec"
        }
    }
}