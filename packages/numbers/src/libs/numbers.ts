import {cli} from 'cli-ux'
import { NumberSpec } from '../../fixtures/number'

export default class Numbers {
  numbers: {
    msisdn: string;
    country: string;
    type: string;
    features: string;
  }[]

  constructor() {
    // normalise features to lowercase for filter later
    this.numbers = NumberSpec.generate(5, 10)
  }

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
    }, {})
  }
}
