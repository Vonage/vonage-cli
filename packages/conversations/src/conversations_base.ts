import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import { readFileSync } from 'fs';
import { merge } from 'lodash';
import { HTTPMethods, ResponseTypes } from './types';

export default abstract class ConversationsCommand extends BaseCommand {
    protected _token!: string
    protected _baseurl = `https://api.nexmo.com/v0.3/conversations`;
    protected _userBaseurl = `https://api.nexmo.com/v0.3/users`;

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
        let app_details_raw = readFileSync(`${process.cwd()}/vonage_app.json`);
        let app_details = (JSON.parse(app_details_raw.toString()));
        this._token = await tokenGenerate(app_details.application_id, app_details.private_key)
        return;
    }

    async init(): Promise<void> {
        await super.init();
        await this._generateJWT();
        return;
    }

    async getAllConversations(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response;
    }

    async createConversation(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async getConversationById(id) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async updateConversation(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}`;
        opts['method'] = HTTPMethods.PUT;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async deleteConversation(id) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.DELETE;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async getAllMembersInConversation(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}/members`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response;
    }

    async getMemberById(params) {
        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}/members/${params.memberID}`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async addMemberToConversation(params) {
        let data = {
            "state": "joined",
            "user": {
                "id": params.userID,
            },
            "channel": {
                "type": "app",
            },
        }

        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}/members`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = data;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async removeMemberFromConversation(params) {
        let data = {
            "state": "left"
        }

        const opts = merge({}, this._defaultHttpOptions)
        opts['url'] = `${this._baseurl}/${params.conversationID}/members/${params.memberID}`;
        opts['method'] = HTTPMethods.PATCH;
        opts['data'] = data;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }

    async getConversationsByUser(params) { 
        const opts = merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._userBaseurl}/${params.userID}/conversations/`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`
        let response = await request(opts);
        return response
    }
}