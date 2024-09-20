const { table, getBorderCharacters }  = require('table');
const {status } = require('../utils/aclDiff');

const tableConfig = {
  singleLine: true,
  drawHorizontalLine: () => false,
  border: getBorderCharacters('void'),
  columns: [
    {
      paddingLeft: 0,
    },
    {
      paddingRight: 0,
    },
  ],
};

const stateChars = {
  [status.OK]: '✅',
  [status.INVALID]: '❌',
  [status.MISSING]: '❌',
  [status.PASS]: 'ℹ️',
  [status.PRESENT]: 'ℹ️',
};

const dumpStatus = (pathStatus) => {
  switch (pathStatus) {
  // Methods or filters *should* never be invalid
  case status.INVALID:
  case status.MISMATCH:
    return 'mismatch';
  case status.MISSING:
    return 'missing in token';
  case status.PRESENT:
    return 'present in token';
  default:
    return '';
  }
};

const dumpAclDiff = ({paths}, infoOnly = false) => {
  const rows = Object.entries(paths).map(([path, data]) => {
    const {methods, methodsStatus, filtersStatus, state} = data;
    const col0 = [
      infoOnly ? stateChars[status.PRESENT] : stateChars[state],
      `[${methods}]`,
    ].join(' ');

    const col1 = [path];

    const messageParts = [];

    if ([status.MISSING, status.PRESENT].includes(state)) {
      messageParts.push('present in token');
    }

    if (methodsStatus !== status.OK) {
      messageParts.push(`methods ${dumpStatus(methodsStatus)}`);
    }

    if (filtersStatus === status.MISMATCH
      || filtersStatus === status.PRESENT && methodsStatus === status.OK
    ) {
      messageParts.push(`filters ${dumpStatus(filtersStatus)}`);
    }

    if (filtersStatus === status.MISSING) {
      messageParts.push('No filter is specified in the token');
    }

    if (messageParts.length) {
      col1.push(`(${messageParts.join(' & ')})`);
    }

    return [col0, col1.join(' ')];
  });

  return rows.length > 0
    ? table(rows, tableConfig)
      .split('\n')
      .map((line) => `${line}`.trim())
      .slice(0, -1)
      .join('\n')
    : '';
};

exports.dumpAclDiff = dumpAclDiff;
