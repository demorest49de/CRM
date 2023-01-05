'use strict';
const list = document.querySelector('.list-product__table-body');

const createRow = ({id, title, price, description, category, discon, count, units, images}) => {
  const tr = document.createElement('tr');
  tr.classList.add('list-product__table-tr');

  tr.innerHTML = `
    <td class="list-product__table-td">${id}</td>
    <td class="list-product__table-td">${title}</td>
    <td class="list-product__table-td">${category}</td>
    <td class="list-product__table-td">${units}</td>
    <td class="list-product__table-td">${count}</td>
    <td class="list-product__table-td">${price}</td>  
  `;

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

};


const renderGoods = () => {
  for (const item of window.goods) {
    createRow(item);
  }
};

renderGoods();