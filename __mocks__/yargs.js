
const yargs = jest.createMockFromModule('yargs');

yargs.exit = jest.fn();

module.exports = yargs;
