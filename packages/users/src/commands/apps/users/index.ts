import { OutputFlags } from '@oclif/core/lib/interfaces';
import { CliUx, Flags } from '@oclif/core';
import UserCommand from '../../../users_base.js';
import { VetchResponse } from '../../../types.js';

const cli = CliUx.ux;

interface IndexFlags {
    page_size: any;
    order: any;
    cursor: any;
}

export default class UsersDefault extends UserCommand<
    typeof UsersDefault.flags
> {
    static description = '';

    static examples = [];

    static flags: OutputFlags<typeof UserCommand.flags> & IndexFlags = {
        ...UserCommand.flags,
        page_size: Flags.string({ description: '', hidden: true }),
        order: Flags.string({ description: '', hidden: true }),
        cursor: Flags.string({ description: '', hidden: true }),
    };

    async run() {
        const flags = this.parsedFlags;
        const response = (await this.getAllUsers(flags)) as VetchResponse;
        const userData = response.data._embedded.users;

        cli.table(
            userData,
            {
                id: {},
                name: {},
            },
            {
                ...flags,
            },
        );
        this.exit();
    }
}
