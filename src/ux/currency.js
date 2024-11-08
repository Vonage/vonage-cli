const displayCurrency = (num) => parseFloat(num).toLocaleString(
  'en-UK',
  {
    style: 'currency',
    currency: 'EUR',
  },
);

exports.displayCurrency = displayCurrency;
