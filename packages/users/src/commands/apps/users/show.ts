import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';
import cli from 'cli-ux';
import chalk from 'chalk';
import { VetchResponse } from '../../../types';

export default class UsersShow extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    static args = [
        ...UserCommand.args,
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

// requires id
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