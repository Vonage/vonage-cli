/// <reference path="../../node_modules/@vonage/server-sdk/typings/index.d.ts" />
import Command, { flags } from '@oclif/command'
import { string } from '@oclif/command/lib/flags';
import * as Vonage from '@vonage/server-sdk';

interface NormalizeInputI {
    name: string
    voice_answer_url: string
    voice_answer_http: string
    voice_event_url: string
    voice_event_http: string
    messages_status_url: string
    messages_status_http: string
    messages_inbound_url: string
    messages_inbound_http: string
    rtc_event_url: string
    rtc_event_http: string
    vbc: boolean
}

interface webhookConfig {
    address?: string
    http_method?: string
}

interface AppRespI {
    name: string
    capabilities: {
        voice?: {
            webhooks: {
                answer_url?: webhookConfig
                event_url?: webhookConfig
            }
        }
        messages?: {
            webhooks: {
                inbound_url?: webhookConfig
                status_url?: webhookConfig
            }
        }
        rtc?: {
            webhooks: {
                event_url?: webhookConfig
            }
        }
        vbc?: object
    }
}

export default abstract class extends Command {
    _vonage!: any

    static flags = {
        help: flags.help({ char: 'h' }),
        apiKey: flags.string(),
        apiSecret: flags.string()
    }

    get vonage() {
        if (this._vonage) return this._vonage

        this._vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY || '',
            apiSecret: process.env.VONAGE_API_SECRET || ''
        })
        return this._vonage
    }

    get allApplications(): any {
        return new Promise((res, rej) => {
            this.vonage.applications.get({}, (error: any, response: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(response);
                }
            }, true);
        })
    }

    createApplication(data: object): any {
        return new Promise((res, rej) => {
            this.vonage.applications.create(data, (error: any, response: any) => {
                if (error) {
                    rej(error)
                } else {
                    res(response)
                }
            })
        })
    }

    getSingleApplication(appId: string): any {
        return appId
    }

    updateApplication(appId: string): any {
        return appId
    }

    deleteApplication(appId: string): any {
        return new Promise((res, rej) => {
            this.vonage.applications.delete(appId, (error: any, result: any) => {
                if (error) {
                    rej(error);
                }
                else {
                    res(result);
                }
            });
        })
    }

    normailzeResponseInput({
        name,
        voice_answer_url,
        voice_answer_http,
        voice_event_url,
        voice_event_http,
        messages_status_url,
        messages_status_http,
        messages_inbound_url,
        messages_inbound_http,
        rtc_event_url,
        rtc_event_http,
        vbc
    }: NormalizeInputI) {

        let response: AppRespI = {
            name: name,
            capabilities: {
                voice: {
                    webhooks: {
                        answer_url: {
                            address: voice_answer_url,
                            http_method: voice_answer_http || 'GET'
                        },
                        event_url: {
                            address: voice_event_url,
                            http_method: voice_event_http || 'GET'
                        }
                    }
                },
                messages: {
                    webhooks: {
                        status_url: {
                            address: messages_status_url,
                            http_method: messages_status_http || 'GET'
                        },
                        inbound_url: {
                            address: messages_inbound_url,
                            http_method: messages_inbound_http || 'GET'
                        }
                    }
                },
                rtc: {
                    webhooks: {
                        event_url: {
                            address: rtc_event_url,
                            http_method: rtc_event_http || 'GET'
                        }
                    }
                },
                vbc: {}
            }
        }


        if (!voice_answer_url) delete response.capabilities.voice!.webhooks.answer_url
        if (!voice_event_url) delete response.capabilities.voice!.webhooks.event_url
        if (!messages_status_url) delete response.capabilities.messages!.webhooks.status_url
        if (!messages_inbound_url) delete response.capabilities.messages!.webhooks.inbound_url
        if (!rtc_event_url) delete response.capabilities.rtc
        if (!vbc) delete response.capabilities.vbc
        
        return response
    }

    async init() {
        // do some initialization
    }
    async catch(err: any) {
        // add any custom logic to handle errors from the command
        // or simply return the parent class error handling
        return super.catch(err);
    }
}