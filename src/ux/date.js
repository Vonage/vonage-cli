const [locale] = process.env.LC_ALL?.split('.') || ['en_US'];

const displayDate = (date) => date
  ? new Date(date).toLocaleString(
    locale.replace('_', '-') || 'en-US',
  )
  : undefined;

exports.displayDate = displayDate;
