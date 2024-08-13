const Table = require('easy-table');

exports.table = (data) => {
  const tbl = new Table;
  data.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      tbl.cell(key, value);
    });

    tbl.newRow();
  });
  return tbl.toString();
};
