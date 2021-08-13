import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import * as fs from 'fs-extra';
import { merge } from 'lodash';
import { HTTPMethods, ResponseTypes } from './types';

export default abstract class ConversationsCommand extends BaseCommand {
    protected _token!: string
    protected _baseurl = `https://api.nexmo.com/v0.3/users`;

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
    };

    static args = [
        ...BaseCommand.args,
    ];

    protected _defaultHttpOptions = {
        "method": HTTPMethods.GET,
        "headers": {},
        'responseType': ResponseTypes.json
    }

    private async _generateJWT() {
        if (!this._appId || !this._keyFile) {
            this.error('Missing appId or private key');
        }

        let private_key = await fs.readFile(`${this._keyFile}`);
        this._token = await tokenGenerate(this._appId, private_key)
        return;
    }

    async init(): Promise<void> {
        await super.init();
        await this._generateJWT();
        return;
    }

    async getAllUsers(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response;
    }

    async getUserById(id) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${id}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async createUser(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async updateUser(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}`;
        opts['method'] = HTTPMethods.PUT;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        console.log(opts)
        try {
            let response = await request(opts);
            return response
        } catch (error) {
            console.dir(error, { depth: 8 })
        }

    }

    async deleteUser(id) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.DELETE;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }
}
