const displayCurrency = (num) => !isNaN(num)
  ? parseFloat(num).toLocaleString(
    'en-UK',
    {
      style: 'currency',
      currency: 'EUR',
    },
  )
  : undefined;

exports.displayCurrency = displayCurrency;
