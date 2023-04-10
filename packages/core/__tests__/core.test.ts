import {expect, test} from '@oclif/test'

describe('Config Command', () => {
  test
  .stdout()
  .command(['show:config'])
  .it('displays the configuration', (ctx) => {
    expect(ctx.stdout).to.contain('hello friend from oclif!')
  })
})

