import { NumberSpec } from '../fixtures/number'

export default class Numbers {
  list(flags: any) {
    let numbers: any[] = NumberSpec.generate(5, 10)

    if (flags.features) {
      const features: string[] = flags.features.split(',').map((f: string) => f.trim())

      numbers = numbers.filter(number => features.some(feature => number.features.includes(feature)))
    }

    return numbers
  }

  search(flags: any) {
    let numbers: any[] = NumberSpec.generate(flags.limit)

    if (flags.features) {
      const features: string[] = flags.features.split(',').map((f: string) => f.trim())

      numbers = numbers.filter(number => features.some(feature => number.features.includes(feature)))
    }

    return numbers
  }

  buy(flags: any) {
    return 'success'
  }
}
