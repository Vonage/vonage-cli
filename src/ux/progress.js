exports.progress = ({
  message,
  columns,
  showSteps = true,
  showPercentage = true,
  arrowChar = '>',
  completedChar = '=',
  remainingChar = '.',
  openChar = '[',
  closeChar = ']',
} = {}) => {
  if (!message) {
    throw new Error('message is required');
  }

  if (arrowChar.length !== 1) {
    throw new Error('arrowChar must be a single character');
  }

  if (completedChar.length !== 1) {
    throw new Error('completedChar must be a single character');
  }

  if (remainingChar.length !== 1) {
    throw new Error('remainingChar must be a single character');
  }

  if (openChar.length !== 1) {
    throw new Error('openChar must be a single character');
  }

  if (closeChar.length !== 1) {
    throw new Error('closeChar must be a single character');
  }

  const terminalWidth = columns && columns >= 20 ? columns : process.stderr.columns || 80;
  if (message.length + 3 >= terminalWidth) {
    throw new Error('message is too long for the terminal width');
  }

  let totalSteps;
  let completedSteps = 0;

  const setTotalSteps = (steps) => {
    totalSteps = steps;
    printProgressBar();
  };

  const increment = (step = 1) => {
    completedSteps += step;
    printProgressBar();
  };

  const finished = () => {
    completedSteps = totalSteps;
    printProgressBar();
    process.stderr.write('\n');
  };

  const getProgress = () => [
    ...(showSteps && [`${completedSteps}/${totalSteps}`] || []),
    ...(showPercentage && [`${Math.round((completedSteps / totalSteps) * 100)}%`] || []),
  ].join(' ');

  const getProgressBarLength = () => {
    let progressLength = message.length + 3;

    if (showSteps) {
      progressLength += `${totalSteps}`.repeat(2).length + 1;
    }

    if (showPercentage) {
      progressLength += 5;
    }

    return terminalWidth - progressLength - 4;
  };

  const printProgressBar = () => {
    if (!totalSteps) {
      return;
    }

    const progressBarWidth = getProgressBarLength();
    const completedLength = Math.round((completedSteps / totalSteps) * progressBarWidth) || 0;
    const remainingLength = progressBarWidth - completedLength;
    const arrow = (completedLength === 0 && remainingChar)
      || (completedLength < progressBarWidth && arrowChar )
      || completedChar;

    process.stderr.write(
      [
        '\r',
        message,
        ' ',
        openChar,
        completedChar.repeat(completedLength),
        arrow,
        remainingChar.repeat(remainingLength),
        closeChar,
        ' ',
        getProgress(),
      ].join(''),
    );
  };

  process.stderr.write(message);

  return {
    setTotalSteps,
    increment,
    finished,
  };
};

