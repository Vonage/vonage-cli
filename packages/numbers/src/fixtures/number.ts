import { createSpec, derived, faker } from '@helpscout/helix'

const locale = 'GB'
faker.locale = locale

const countryCode = Math.floor(Math.random() * 45)

export const NumberSpec = createSpec({
  number: faker.phone.phoneNumberFormat(1),
  msisdn: derived(({ number }) => {
    return `${countryCode}${number.replace(/\D/g, '')}`
  }),
  country: locale,
  type: faker.random.arrayElement(["mobile-lvn"]),
  features: faker.random.arrayElement(["voice", "sms"]),
})