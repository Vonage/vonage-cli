const readline  = require('readline');
const parser = require('yargs-parser');

const { argv } = parser.detailed(process.argv);
const { force } = argv;

const ask = (message) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${message} [y/n] `, (answer) => {
    resolve(answer.toLowerCase());
    rl.close();
  });
});

exports.confirm = async (
  message,
  noForce = false,
) =>{
  if (!noForce && force) {
    console.debug(`Forcing: ${message}`);
    return true;
  }

  console.debug(`Confirming: ${message}`);

  let answerCorrectly = false;
  do {
    const answer = await ask(message);

    if ([ 'y', 'n' ].includes(answer)) {
      answerCorrectly = true;
      return answer === 'y';
    }

    process.stderr.write('Please answer with y for yes or n for no\n');
  } while (!answerCorrectly);
};
