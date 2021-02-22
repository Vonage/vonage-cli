import Command from '../../helpers/base'
import { flags, } from '@oclif/command'
import { prompt } from 'prompts'
import { webhookQuestions } from '../../helpers'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'
import { merge } from 'lodash';
import * as fs from 'fs';
import cli from 'cli-ux';
import chalk from 'chalk';

export default class ApplicationsRemove extends Command {
    static description = 'Remove numbers from Vonage application'

    static examples = []

    static flags = {
        ...Command.flags,
    }

    static args = [
        { name: 'lvn', required: false }
    ]

    async run() {
        const { args, flags }: { args: any, flags: { [index: string]: any } } = this.parse(ApplicationsRemove)

        // get the number details, or error if number doesn't exist
        let number = await this.listNumbers(args.lvn)

        // update the number with appid, lvn, country
        let response = await this.updateNumber(args.lvn, number.numbers[0].country);

        if (response['error-code'] === '200') {
            this.log(`Number '${args.lvn}' has been unassigned.`);
            this.exit()
        }

        this.log(response);
    }

    // async catch(error: any) {}
}