const readline  = require('readline');

exports.confirm = (
  message,
) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`${message} [y/n] `, (answer) => {
    resolve(answer.toLowerCase() === 'y');
    rl.close();
  });
});
