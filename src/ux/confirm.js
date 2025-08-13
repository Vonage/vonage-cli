const parser = require('yargs-parser');
const { inputFromTTY } = require('./input.js');
const { EOL } = require('os');

const { argv } = parser.detailed(process.argv);
const { force } = argv;

/**
 * @typedef { Object } ConfirmOptions
 * @property { boolean } [noForce=false] - If true, disables automatic confirmation via `--force`.
 * @property { string[] } [allowedResponses=['y','n']] - Accepted response characters.
 * @property { string } [truthyResponse=y] - Value that is marked as a truthy response
 * @property { string } [invalidMessage='Please answer with a y for yes and n for no'] - Message shown on invalid input.
 */

/**
 * Prompts the user to confirm an action, unless `--force` is passed.
 *
 * @param { string } message - The confirmation message to display.
 * @param { ConfirmOptions } [options] - Optional settings for user prompt behavior.
 * @returns { Promise<boolean> } - Resolves to `true` if user confirms, `false` otherwise.
 */
exports.confirm = async (
  message,
  {
    noForce = false,
    allowedResponses = ['y', 'n'],
    truthyResponse = 'y',
    invalidMessage = 'Please answer with a y for yes and n for no',
    defaultResponse,
  } = {},
) =>{
  if (!noForce && force) {
    console.debug(`Forcing: ${message}`);
    return true;
  }

  while (true) {
    const answer = await inputFromTTY(
      {
        message: message,
        length: 1,
      },
    );

    if (defaultResponse && !answer) {
      return defaultResponse;
    }

    const normalized = String(answer).toLowerCase();

    if (allowedResponses.includes(normalized)) {
      process.stderr.write(EOL);
      return normalized === String(truthyResponse).toLowerCase();
    }

    process.stderr.write(`${EOL}${invalidMessage}${EOL}`);
  };
};
