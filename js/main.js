'use strict';
const list = document.querySelector('.list-product__table-body');

const createRow = ({id, title, price, description, category, discont, count, units, images}) => {
  const tr = document.createElement('tr');
  tr.classList.add('list-product__table-tr');

  tr.innerHTML = `
    <td class="list-product__table-td">${id}</td>
    <td class="list-product__table-td">${title}</td>
    <td class="list-product__table-td">${category}</td>
    <td class="list-product__table-td">${units}</td>
    <td class="list-product__table-td">${count}</td>
    <td class="list-product__table-td">${price}</td>
    <td class="list-product__table-td">$${
    Math.floor(price * count * (1 - (discont ? discont / 100 : discont)))
  }</td>
    <td class="list-product__table-td">
    <button class="list-product__table-btn 
    ${images && images?.small || images?.big ? 'list-product__button-img' : 'list-product__button-no-img'}" aria-label="image"></button>
    <button class="list-product__table-btn list-product__button-edit" aria-label="edit"></button>
    <button class="list-product__table-btn list-product__button-delete" aria-label="delete"></button>
    </td>
  `;
  return tr;
};


const renderGoods = () => {
  for (const item of window.goods) {
    list.append(createRow(item));
  }
};

renderGoods();