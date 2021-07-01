import { NumberInsightCommand } from '@vonage/cli-utils';
import { OutputFlags, OutputArgs, flags } from '@oclif/parser';
import { startCase, toLower } from 'lodash';
import { prompt } from 'prompts'
import chalk from 'chalk';
import cli from 'cli-ux'

interface NIFlags {
  level: any,
  confirm: any
}

function notBasic(level) {
  return level === 'standard' || level === 'advancedSync';
}

export default class NumberInsight extends NumberInsightCommand {
  static description = 'manage your Vonage numbers'

  static examples = [
    `$ vonage numberinsight 5555555555
$ vonage numberinsight 5555555555 --level=advanced
`,
  ]

  static flags: OutputFlags<typeof NumberInsightCommand.flags> & NIFlags = {
    ...NumberInsightCommand.flags,
    level: flags.string({
      required: false,
      default: 'basic',
      parse: input => input === 'advanced' ? `advancedSync` : input,
      options: ['basic', 'standard', 'advanced']
    }),
    confirm: flags.boolean({ char: 'y', required: false })
  }

  static args: OutputArgs<typeof NumberInsightCommand.args> = [
    { name: 'number', required: true },
  ]

  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof NumberInsightCommand.flags> & NIFlags;
    const args = this.parsedArgs!;


    if (notBasic(flags.level) && !flags.confirm) {
      let response = await prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `This operation will charge your account. Proceed?`,
          initial: false
        }
      ])

      if (response.confirm === false) {
        this.log('Cancelled Number Insights operation.')
        this.exit()
      };
    }

    cli.action.start(chalk.bold('Fetching Insights'));

    let insights = await this.getInsights(args.number, flags.level)

    cli.action.stop();

    if (insights.status !== 0) {
      this.log(insights.status_message)
      this.exit();
    }


    this.log(chalk.underline.bold.inverse(`Number Insights - ${startCase(toLower(flags.level))}`));
    this.log();

    if (flags.level === 'advancedSync') {
      this.log(insights.lookup_outcome_message);
      this.log();
    }

    this.log(chalk.bold(`Number Formats`));
    this.log(`National: ${insights.national_format_number}`);
    this.log(`International: ${insights.international_format_number}`);
    this.log();

    this.log(chalk.bold(`Country Details`));
    this.log(`Country: ${insights.country_name}`);
    this.log(`Country Code: ${insights.country_code}`);
    this.log(`ISO 3 Code: ${insights.country_code_iso3}`);
    this.log(`Prefix: ${insights.country_prefix}`);

    if (notBasic(flags.level)) {
      this.log();
      this.log(chalk.bold(`Current Carrier`));
      this.log(`Name: ${insights.current_carrier.name}`);
      this.log(`Country: ${insights.current_carrier.country}`);
      this.log(`Network Type: ${insights.current_carrier.netowrk_type}`);
      this.log(`Network Code: ${insights.current_carrier.network_code}`);
      this.log();
      this.log(chalk.bold(`Original Carrier`));
      this.log(`Name: ${insights.original_carrier.name}`);
      this.log(`Country: ${insights.original_carrier.country}`);
      this.log(`Network Type: ${insights.original_carrier.netowrk_type}`);
      this.log(`Network Code: ${insights.original_carrier.network_code}`);
      this.log();
      this.log(chalk.bold(`Ported: ${insights.ported}`))
      this.log();
      this.log(chalk.bold(`Roaming Status: ${insights.roaming.status}`));
    }
    if (flags.level === 'advancedSync') {
      this.log();
      this.log(chalk.bold(`Valid Number: ${insights.valid_number}`));
      this.log();
      this.log(chalk.bold(`Reachable: ${insights.reachable}`));
    }

    if (notBasic(flags.level)) {
      this.log();
      this.log(chalk.bold('Account Balance'));
      this.log(`Request Cost: ${insights.request_price}`)
      this.log(`Remaining Balance: ${insights.remaining_balance}`)
    }

    this.exit();
  }
}
