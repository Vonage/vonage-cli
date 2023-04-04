import {expect, test} from '@oclif/test'

describe('hello', () => {
  test
  .stdout()
  .command(['show:config'])
  .it('runs show cmd', ctx => {
    expect(ctx.stdout).to.contain('hello friend from oclif!')
  })
})

