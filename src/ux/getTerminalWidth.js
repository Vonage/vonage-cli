/**
 * Returns the terminal width using:
 *
 * 1. TERM_WIDTH from environment (if valid)
 * 2. process.stdout.columns (if available)
 * 3. Fallback to 80
 */
exports.getTerminalWidth = () =>
  Math.min(...[
    // Allow to be set in the term
    parseInt(process.env.TERM_WIDTH, 10),
    // Use the default width from the terminal
    process.stdout?.columns,
    // fallback to 80 columns
    80,
  ].filter((width) => Number.isInteger(width) && width > 0));
