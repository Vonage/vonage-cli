const readline  = require('readline');
const parser = require('yargs-parser');

const { argv } = parser.detailed(process.argv);
const { force } = argv;

exports.confirm = (
  message,
  noForce = false,
) => new Promise((resolve) => {
  if (!noForce && force) {
    console.debug(`Forcing: ${message}`);
    resolve(true);
    return;
  }

  console.debug(`Confirming: ${message}`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${message} [y/n] `, (answer) => {
    console.debug(`Answer: ${answer}`);
    resolve(answer.toLowerCase() === 'y');
    rl.close();
  });
});
