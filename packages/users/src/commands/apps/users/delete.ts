import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';

export default class UsersDelete extends UserCommand {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    async run() {
        this.deleteUser();
    }
}

// requires id

// response 204