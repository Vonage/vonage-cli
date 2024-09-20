exports.indentLines = (lines, indent) => {
  const indentStr = ' '.repeat(indent);
  const linesArray = Array.isArray(lines) ? lines : lines.split('\n');
  return linesArray.map((line) => `${indentStr}${line}`).join('\n');
};
