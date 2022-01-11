Fancy Test - 
https://github.com/oclif/fancy-test


Chai - expect
https://www.chaijs.com/guide/styles/#expect


Example - 
https://github.com/heroku/cli/blob/master/packages/apps-v5/test/commands/apps/create.js



'use strict'
/* globals describe beforeEach it commands */

const nock = require('nock')
const expect = require('chai').expect
const topic = commands.find(c => c.topic === 'topic' && c.command === 'command')
const Config = require('@oclif/config')
let config
const baseHost = `https:www.test.com`

describe('topic:command', function () {
  beforeEach(async () => {
    config = await Config.load()
    cli.mockConsole()
    nock.cleanAll()
    
    // if you consistently need to run a route, to look up something - add it here as well.
    // nock(apiHost)
    //     .get('/something_else')
    //     .reply(200, { some: 'data' })
    // })
  }) // figure out exactly what you might need before _every single test_
  afterEach(() => nock.cleanAll())
  const typicalResponse = {
    foo: 'bar'
    // can be anything you may want to reuse
  }

  it('has some flag', function () {
    expect(topic).to.have.own.property('flagName', true)
  })

//   it('has some arg', function () {
//     expect(topic).to.have.own.property('', true)
//   })

//   it('has some example', function () {
//     expect(topic).to.have.own.property('', true)
//   })

//   it('has some description', function () {
//     expect(topic).to.have.own.property('', true)
//   })

  it('does what you would expect', function () {
    let mock = nock(baseHost)
      .post('/routeName',  {})
      .reply(200, typicalResponse)

    return topic.run({ flags: {}, args: {}, config }).then(function () {
      mock.done()
      expect(cli.stderr).to.equal('Some output here\n')
      expect(cli.stdout).to.equal('Some final output\n')
    })
  })

  it('does what you would expect, but with a flag', function () {
      let flagsResponse = {
          ...typicalResponse,
          fizz: "buzz"
      }
    let mock = nock(baseHost)
        .post('/routeName', {fizz: 'buzz'})
        .reply(200, flagsResponse)

    return topic.run({ flags: { fizz: 'buzz' }, args: {}, config }).then(function () {
      mock.done()
      expect(cli.stderr).to.equal('Some output here\n')
      expect(cli.stdout).to.equal('Some final output\n')
    })
  })


  it('does not do things it shouldnt', function () {
    let thrown = false
    return topic.run({ flags: { something: 'bad' }, args: {}, config })
      .catch(function (err) {
        expect(err).to.be.an.instanceof(Error)
        expect(err.message).to.equal('Some error text.\nBetter description of what happened.\nUSAGE: how to do it right (as a command)')
        thrown = true
      })
      .then(() => expect(thrown).to.equal(true))
  })
})



// What exactly do we test for each command?
// 'with no args'
// shows as json
