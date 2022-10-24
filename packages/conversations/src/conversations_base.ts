import VonageCommand from '@vonage/cli-utils';
import { tokenGenerate } from '@vonage/jwt';
import { request } from '@vonage/vetch';
import { readFileSync } from 'fs';
import _ from 'lodash';
import { HTTPMethods, ResponseTypes } from './types.js';

export default abstract class ConversationsCommand<T>
    extends VonageCommand<typeof ConversationsCommand> {
    protected _token!: string;
    protected _baseurl = `https://api.nexmo.com/v0.3/conversations`;
    protected _userBaseurl = `https://api.nexmo.com/v0.3/users`;

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
        if (error.status === 400) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail],
            });
        }

        if (error.status === 401) {
            this.error('Authentication Failure', {
                code: 'API_AUTH_ERR',
                suggestions: [
                    // eslint-disable-next-line max-len
                    'Check the "vonage_app.json" and make sure the information is correct',
                    // eslint-disable-next-line max-len
                    'Verify your Api Key and Api Secret with "vonage config".',
                ],
            });
        }

        if (error.status === 404) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail],
            });
        }

        if (error.status === 500) {
            this.error(error.statusText, {
                code: error.data.code,
                suggestions: [error.data.detail],
            });
        }

        return super.catch(error);
    }

    async init(): Promise<void> {
        await super.init();
        await this._generateJWT();
        return;
    }

    async getAllConversations(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async createConversation(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async getConversationById(id) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async updateConversation(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${params.conversationID}`;
        opts['method'] = HTTPMethods.PUT;
        delete params.conversationID;
        opts['data'] = params;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async deleteConversation(id) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${id}`;
        opts['method'] = HTTPMethods.DELETE;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async getAllMembersInConversation(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${params.conversationID}/members`;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async getMemberById(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts[
            'url'
        ] = `${this._baseurl}/${params.conversationID}/members/${params.memberID}`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async addMemberToConversation(params) {
        const data = {
            state: 'joined',
            user: {
                id: params.userID,
            },
            channel: {
                type: 'app',
            },
        };

        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._baseurl}/${params.conversationID}/members`;
        opts['method'] = HTTPMethods.POST;
        opts['data'] = data;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async removeMemberFromConversation(params) {
        const data = {
            state: 'left',
        };

        const opts = _.merge({}, this._defaultHttpOptions);
        opts[
            'url'
        ] = `${this._baseurl}/${params.conversationID}/members/${params.memberID}`;
        opts['method'] = HTTPMethods.PATCH;
        opts['data'] = data;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }

    async getConversationsByUser(params) {
        const opts = _.merge({}, this._defaultHttpOptions);
        opts['url'] = `${this._userBaseurl}/${params.userID}/conversations/`;
        opts['method'] = HTTPMethods.GET;
        opts['headers']['Authorization'] = `Bearer ${this._token}`;
        const response = await request(opts);
        return response;
    }
}
