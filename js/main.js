'use strict';
const list = document.querySelector('.list-product__table-body');

const createRow = (rowObject) => {
  const tr = document.createElement('tr');
  tr.classList.add('list-product__table-tr');
  const keys = Object.keys(rowObject);
  const values = Object.values(rowObject);

  const generateTableRow = () => {
    const tdNames = ['id', 'title', 'category', 'units', 'count', 'price'];
    for (const name of tdNames) {
      handleData(name);
    }
    calculateTotal();
    addButtons();
    list.append(tr);
    console.log(': ', tr);
  };

  const addButtons = () => {
    const btnImg = [`list-product__button-img`, `image`];
    const btnEdit = [`list-product__button-edit`, `edit`];
    const btnDel = [`list-product__button-delete`, `delete`];
    const btnsArray = [btnImg, btnEdit, btnDel];
    const td = document.createElement('td');
    td.classList.add('list-product__table-td');
    for (const [btnclass, areaLabel] of btnsArray) {
      const btn = document.createElement('button');
      btn.classList.add('list-product__table-btn');
      btn.classList.add(btnclass);
      btn.setAttribute('aria-label', areaLabel);
      td.append(btn);
    }
    tr.append(td);
  };

  const calculateTotal = () => {
    const count = +values[keys.findIndex(item => item === 'count')];
    const price = +values[keys.findIndex(item => item === 'price')];
    tr.append(generateTableData(count * price));
  };

  const handleData = (value) => {
    const result = values[keys.findIndex(item => item === value)];
    tr.append(generateTableData(result));
  };

  const generateTableData = (value) => {
    const td = document.createElement('td');
    td.classList.add('list-product__table-td');
    td.textContent = value;
    return td;
  };

  generateTableRow();
};


const renderGoods = () => {
  for (const item of window.goods) {
    createRow(item);
  }
};

renderGoods();