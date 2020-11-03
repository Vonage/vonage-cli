import {cli} from 'cli-ux'

export default class Numbers {
  numbers: {
    msisdn: string;
    country: string;
    type: string;
    features: string[];
    voiceCallbackType: string;
    voiceCallbackValue: string;
    moHttpUrl: string;
    voiceStatusCallbackUrl: string;
  }[]

  constructor() {
    // normalise features to lowercase for filter later
    this.numbers = this.dummyData.map((d: any) => ({...d, features: d.features.map((f: string) => f.toLowerCase())}))
  }

  readonly dummyData: {
    msisdn: string;
    country: string;
    type: string;
    features: string[];
    voiceCallbackType: string;
    voiceCallbackValue: string;
    moHttpUrl: string;
    voiceStatusCallbackUrl: string;
  }[] = [
    {
      msisdn: '447441441813',
      country: 'GB',
      type: 'mobile-lvn',
      features: ['VOICE', 'SMS'],
      voiceCallbackType: 'app',
      voiceCallbackValue: 'ff61891c-81b1-46da-8035-ea8201725e31',
      moHttpUrl: 'undefined',
      voiceStatusCallbackUrl: 'undefined',
    },
    {
      msisdn: '447441444143',
      country: 'GB',
      type: 'mobile-lvn',
      features: ['SMS'],
      voiceCallbackType: 'app',
      voiceCallbackValue: 'ff41191c-81b1-46da-8035-ea82h4h25e31',
      moHttpUrl: 'undefined',
      voiceStatusCallbackUrl: 'undefined',
    },
    {
      msisdn: '447854083219',
      country: 'GB',
      type: 'mobile-lvn',
      features: ['VOICE'],
      voiceCallbackType: 'app',
      voiceCallbackValue: 'ff41191c-81b1-46da-8035-ea82h4h25e31',
      moHttpUrl: 'undefined',
      voiceStatusCallbackUrl: 'undefined',
    },
  ]

  list(flags: any) {
    if (flags.features) {
      const features: string[] = flags.features.split(',').map((f: string) => f.trim())

      this.numbers = this.numbers.filter(number => features.some(feature => number.features.includes(feature)))
    }

    cli.table(this.numbers, {
      msisdn: {},
      country: {},
      type: {},
      features: {},
      voiceCallbackType: {},
      voiceCallbackValue: {},
      moHttpUrl: {},
      voiceStatusCallbackUrl: {},
    }, {})
  }
}
