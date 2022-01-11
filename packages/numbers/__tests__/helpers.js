process.env.VONAGE_API_KEY = '12345'
process.env.VONAGE_API_SECRET = 'ABCDE'
process.env.TZ = 'UTC' // Use UTC time always
process.stdout.columns = 80 // Set screen width for consistent wrapping
process.stderr.columns = 80 // Set screen width for consistent wrapping

let nock = require('nock')
nock.disableNetConnect()
