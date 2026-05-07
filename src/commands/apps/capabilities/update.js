export const command = 'update <id> <which>';

export const description = 'Update application capabilities';

export const builder = (yargs) => yargs.commandDir('update')
  .positional(
    'id',
    {
      type: 'string',
      describe: 'The application ID',
    },
  );

