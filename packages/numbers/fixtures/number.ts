import { createSpec, faker } from '@helpscout/helix'

const locale = 'GB'
faker.locale = locale

export const NumberSpec = createSpec({
  msisdn: faker.phone.phoneNumberFormat(1),
  country: locale,
  type: faker.random.arrayElement(["mobile-lvn"]),
  features: faker.random.arrayElement(["voice", "sms"]),
})