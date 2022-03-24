import { OutputFlags } from '@oclif/parser';
import UserCommand from '../../../users_base';
import chalk from 'chalk';
import { ArgInput } from '@oclif/core/lib/interfaces';


export default class UsersDelete extends UserCommand<typeof UsersDelete.flags> {
    static description = ""

    static examples = [
    ]

    static flags: OutputFlags<typeof UserCommand.flags> = {
        ...UserCommand.flags
    }

    static args: ArgInput = [
        { name: 'userID', required: false },
    ]

    async run() {
        const args = this.parsedArgs!;

        await this.deleteUser(args.userID);

        this.log(`User ${chalk.bold(args.userID)} deleted.`)
    }
}