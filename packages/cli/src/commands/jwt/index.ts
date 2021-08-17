import BaseCommand from '@vonage/cli-utils';
import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser';
import { readFileSync } from 'fs';
import * as path from 'path';


interface GenerateJWTFlags {
    app_id: any,
    key_file: any,
    subject?: any,
    acl?: any,
}


export default class GenerateJWT extends BaseCommand {

    static description = 'generate a Vonage JWT token'

    static examples = []

    static flags: OutputFlags<typeof BaseCommand.flags> & GenerateJWTFlags = {
        ...BaseCommand.flags,
        app_id: flags.string({ required: true }),
        key_file: flags.string({ required: true }),
        subject: flags.string({ required: false }),
        acl: flags.string({ required: false, default: '{}' }),
    }

    static args = [
        ...BaseCommand.args,
    ]

    async run() {

        const flags = this.parsedFlags as OutputFlags<typeof BaseCommand.flags> & GenerateJWTFlags
        let private_key = readFileSync(flags.key_file.replace(/(\s+)/g, '\\$1'));
        let claims = { application_id: flags.app_id, sub: flags.subject, acl: JSON.parse(flags.acl) }
        let jwt = this.Vonage.generateJwt(private_key, claims)

        this.log(jwt)
        this.exit()

    }
}