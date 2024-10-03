const readline  = require('readline');

exports.confirm = (
  message,
) => new Promise((resolve) => {
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
