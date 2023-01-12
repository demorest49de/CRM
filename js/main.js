'use strict';

{
  const createContainer = () => {
    const container = document.createElement('div');
    container.classList.add('container');
    return container;
  };

  const createSection = () => {
    const section = document.createElement('section');
    return section;
  };

  const createHeader = () => {
    const header = document.createElement('div');
    header.classList.add('list-product__header');
    const headerContainer = createContainer();
    header.append(headerContainer);
    header.headerContainer = headerContainer;

    return header;
  };

  const createLogo = (title) => {
    const h1 = document.createElement('h1');
    h1.classList.add('list-product__title');
    h1.textContent = `crm`;
    return h1;
  };

  const createElem = (elem) => {
    return document.createElement(elem);
  };

  const listProductSum = createElem('div');
  listProductSum.classList.add('list-product__sum card-sum');
  listProductSum.insertAdjacentHTML('beforeend',
    `
      <span class="card-sum__text">Итоговая стоимость:</span>
    `);
  const cardSumPrice = createElem('span');
  listProductSum.append(cardSumPrice.classList.add('card-sum__price'));

  const renderCRM = (app) => {

  };

  const init = selectorApp => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app);
    const {list, logo, btnAdd, overlay, form} = crm;

    // Функционал

    const allRow = renderItems(list, window.goods);

    // const addItem = document.querySelector('.add-item');
    // const addItemCloseButton = document.querySelector('.add-item-close-button');

    btnAdd.addEventListener('click', () => {
      overlay.classList.remove('is-visible');
    });

    // addItem.addEventListener('click', event => {
    //   event.stopPropagation();
    // });
    //
    // addItemCloseButton.addEventListener('click', () => {
    //   overlay.classList.add('is-visible');
    // });
    //
    // overlay.addEventListener('click', () => {
    //   overlay.classList.add('is-visible');
  };

  window.listProductInit = init;
}


// const list = document.querySelector('.list-product__table-body');
//
// const createRow = ({id, title, price, description, category, discont, count, units, images}) => {
//   const tr = document.createElement('tr');
//   tr.classList.add('list-product__table-tr');
//
//   tr.innerHTML = `
//     <td class="list-product__table-td">${id}</td>
//     <td class="list-product__table-td">${title}</td>
//     <td class="list-product__table-td">${category}</td>
//     <td class="list-product__table-td">${units}</td>
//     <td class="list-product__table-td">${count}</td>
//     <td class="list-product__table-td">${price}</td>
//     <td class="list-product__table-td">$${
//     Math.floor(price * count * (1 - (discont ? discont / 100 : discont)))
//   }</td>
//     <td class="list-product__table-td">
//     <button class="list-product__table-btn
//     ${images && images?.small || images?.big ? 'list-product__button-img' : 'list-product__button-no-img'}" aria-label="image"></button>
//     <button class="list-product__table-btn list-product__button-edit" aria-label="edit"></button>
//     <button class="list-product__table-btn list-product__button-delete" aria-label="delete"></button>
//     </td>
//   `;
//   return tr;
// };
//
// const renderGoods = () => {
//   for (const item of window.goods) {
//     list.append(createRow(item));
//   }
// };
//
// renderGoods();
//
//

// });