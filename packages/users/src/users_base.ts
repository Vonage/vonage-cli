import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import { readFileSync } from 'fs';
import { merge } from 'lodash';
import { HTTPMethods, ResponseTypes } from './types';

export default abstract class UsersCommand<T extends typeof BaseCommand.flags> extends BaseCommand<T> {
    protected _token!: string
    protected _baseurl = `https://api.nexmo.com/v0.3/users`;
    protected parsedArgs
    protected parsedFlags

    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
    };

    static args: ArgInput = {
        ...BaseCommand.args,
    };

    protected _defaultHttpOptions = {
        "method": HTTPMethods.GET,
        "headers": {},
        'responseType': ResponseTypes.json
    }

    private async _generateJWT() {
        let app_details_raw = readFileSync(`${process.cwd()}/vonage_app.json`);
        let app_details = (JSON.parse(app_details_raw.toString()));
        this._token = await tokenGenerate(app_details.application_id, app_details.private_key)
        return;
    }

    async catch(error: any) {
        return super.catch(error);
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
        opts['url'] = `${this._baseurl}/${params.userID}`;
        opts['method'] = HTTPMethods.PATCH;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
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
