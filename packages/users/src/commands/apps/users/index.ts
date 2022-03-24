import { OutputFlags } from '@oclif/parser';
import { flags } from '@oclif/command'
import UserCommand from '../../../users_base';
import cli from 'cli-ux';
import { VetchResponse } from '../../../types';

interface IndexFlags {
    page_size: any
    order: any
    cursor: any
}

export default class UsersDefault extends UserCommand<typeof UsersDefault.flags> {
    static description = ""

    static examples = [
    ]


    static flags: OutputFlags<typeof UserCommand.flags> & IndexFlags = {
        ...UserCommand.flags,
        'page_size': flags.string({ description: '', hidden: true }),
        'order': flags.string({ description: '', hidden: true }),
        'cursor': flags.string({ description: '', hidden: true }),
    }

    async run() {
        const flags = this.parsedFlags
        let response = await this.getAllUsers(flags) as VetchResponse;
        let userData = response.data._embedded.users;

        cli.table(userData, {
            id: {},
            name: {}
        }, {
            ...flags
        });
        this.exit();
    }

}