var getColumns = (t) => {
  const trs = t.querySelectorAll('tr');

  const temp = [];

  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    temp.push(Array.prototype.map.call(tds, td => td.innerText));
  });

  const length = temp[0].length;

  const response = [];
  for (let ii = 0; ii < length; ii++) {
    const res = [];

    temp.forEach(t => {
      const n = Number.parseInt(t[ii]);

      if (!Number.isNaN(n)) {
        res.push(n);
      }
    });

    response.push(res);
  }

  console.log('COLUMNS:  ', JSON.stringify(response));

};


var getRows = (t) => {
  const trs = t.querySelectorAll('tr');

  const response = [];

  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');

    const res = [];

    tds.forEach(td => {
      const n = Number.parseInt(td.innerText);

      if (!Number.isNaN(n)) {
        res.push(n);
      }
    });

    response.push(res);
  });

  console.log('ROWS:  ', JSON.stringify(response));
};


function getData() {
  const table = window.document.getElementById('nonogram_table');

  const colTable = table.querySelector('tbody .nmtt table');
  const rowTable = table.querySelector('tbody .nmtl table');

  getColumns(colTable);
  getRows(rowTable);
}

getData();
