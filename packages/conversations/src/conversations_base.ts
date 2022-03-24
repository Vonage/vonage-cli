import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';
import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import { readFileSync } from 'fs';
import { merge } from 'lodash';
import { HTTPMethods, ResponseTypes } from './types';

export default abstract class ConversationsCommand<T extends typeof BaseCommand.flags> extends BaseCommand<T> {
    protected _token!: string
    protected _baseurl = `https://api.nexmo.com/v0.3/conversations`;
    protected _userBaseurl = `https://api.nexmo.com/v0.3/users`;
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
        if (error.status === 400) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail]
            }
            )
        }

        if (error.status === 401) {
            this.error('Authentication Failure', {
                code: 'API_AUTH_ERR',
                suggestions: [
                    "Check the 'vonage_app.json' and make sure the information is correct",
                    "Verify your Api Key and Api Secret with 'vonage config'.",
                ]
            }
            )
        }

        if (error.status === 404) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail]
            }
            )
        }

        if (error.status === 500) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail]
            }
            )
        }

        return super.catch(error);
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
        delete params.conversationID;
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