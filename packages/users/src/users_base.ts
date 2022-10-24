import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import { readFileSync } from 'fs';
import _ from 'lodash';
import { HTTPMethods, ResponseTypes } from './types.js';
import VonageCommand from '@vonage/cli-utils';

export default abstract class UsersCommand<T>
    extends VonageCommand<typeof UsersCommand> {
    protected _token!: string;
    protected _baseurl = `https://api.nexmo.com/v0.3/users`;
    protected parsedArgs;
    protected parsedFlags;

    protected _defaultHttpOptions = {
        method: HTTPMethods.GET,
        headers: {},
        responseType: ResponseTypes.json,
    };

    private async _generateJWT() {
        const appDetailsRaw = readFileSync(`${process.cwd()}/vonage_app.json`);
        const appDetails = JSON.parse(appDetailsRaw.toString());
        this._token = await tokenGenerate(
            appDetails.application_id,
            appDetails.private_key,
        );
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
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async getUserById(id) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${id}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async createUser(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async updateUser(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${params.userID}`;
        opts['method'] = HTTPMethods.PATCH;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async deleteUser(id) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.DELETE;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }
}
