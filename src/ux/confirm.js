const parser = require('yargs-parser');
const { inputFromTTY } = require('./input.js');
const { EOL } = require('os');

const { argv } = parser.detailed(process.argv);
const { force } = argv;

exports.confirm = async (
  message,
  {
    noForce,
    allowedResponses = ['y', 'n'],
    invalidMessage = 'Please answer with a y for yes and n for no',
  } = {},
) =>{
  if (!noForce && force) {
    console.debug(`Forcing: ${message}`);
    return true;
  }

  let answerCorrectly = false;
  do {
    const answer = await inputFromTTY(
      {
        message: message,
        length: 1,
      },
    );

    if (allowedResponses.includes(String(answer))) {
      answerCorrectly = true;
      process.stderr.write(EOL);
      return answer === 'y';
    }

    process.stderr.write(`${EOL}${invalidMessage}${EOL}`);
  } while (!answerCorrectly);
};
