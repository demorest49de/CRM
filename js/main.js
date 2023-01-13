'use strict';


{
  const addClass = (element, ...tokens) => {
    element.classList.add(tokens);
  };

  const createContainer = () => {
    const container = document.createElement('div');
    addClass(container, 'container');
    return container;
  };

  const createSection = () => {
    const section = document.createElement('section');
    addClass(section, ('list-product'));
    const container = createContainer();
    section.container = container;
    section.append(container);
    return section;
  };

  const createLogo = (title) => {
    const h1 = document.createElement('h1');
    h1.classList.add('list-product__title');
    h1.textContent = title;
    return h1;
  };

  const createTitleSum = () => {
    const titleSum = createElem('div');
    addClass(titleSum, ['list-product__sum', 'card-sum']);
    titleSum.insertAdjacentHTML('beforeend',
      `
      <span class="card-sum__text">Итоговая стоимость:</span>
    `);
    const cardSumPrice = createElem('span');
    addClass(cardSumPrice, 'card-sum__price');
    cardSumPrice.textContent = `$0.00`;
    titleSum.append(cardSumPrice);
    return titleSum;
  };

  const createHeader = (title) => {
    const header = document.createElement('div');
    addClass(header, 'list-product__header');
    const logo = createLogo(title);
    header.append(logo);
    const titleSum = createTitleSum();
    header.append(titleSum);
    return header;
  };

  const createElem = (elem) => {
    return document.createElement(elem);
  };

  const createNav = () => {
    const nav = createElem('div');
    addClass(nav, ['list-product__nav', 'nav']);
    const navBlock = createElem('div');
    addClass(navBlock, 'nav__block');
    nav.append(navBlock);

    const filterBtn = createElem('button');
    addClass(filterBtn, 'nav__filter-btn');
    filterBtn.textContent = 'Фильтр';
    navBlock.append(filterBtn);

    const form = createElem('form');
    addClass(form, 'nav__search');
    form.insertAdjacentHTML('beforeend',
      `
        <input class="nav__input" type="search" placeholder="Поиск по наименованию и категории">      
      `);
    navBlock.append(form);

    const addItemBtn = createElem('button');
    addClass(addItemBtn, 'nav__add-btn');
    addItemBtn.textContent = 'Добавить товар';
    navBlock.append(addItemBtn);

    return nav;
  };

  const createWrapper = () => {
    const wrapper = createElem('div');
    addClass(wrapper, 'list-product__wrapper');
    const table = createElem('table');
    addClass(table, 'list-product__table');
    wrapper.append(table);
    const thead = createElem('thead');
    addClass(thead, 'list-product__table-head');
    thead.insertAdjacentHTML('beforeend',
      `
        <tr>
        <th class="list-product__table-td">ID</th>
        <th class="list-product__table-td">Наименование</th>
        <th class="list-product__table-td">Категория</th>
        <th class="list-product__table-td">Ед/Изм</th>
        <th class="list-product__table-td">Количество</th>
        <th class="list-product__table-td">Цена</th>
        <th class="list-product__table-td">Итог</th>
        <th class="list-product__table-td"></th>
      </tr>
      `);
    const tbody = createElem('tbody');
    addClass(tbody, 'list-product__table-body');
    table.append(thead, tbody);
    table.tbody = tbody;
    return {
      tbody,
      wrapper
    };
  };
  const createFooter = () => {
    const footer = createElem('div');
    addClass(footer, 'list-product__footer');
    return footer;
  };

  const createMainBlock = () => {
    const mainBlock = createElem('div');
    addClass(mainBlock, 'list-product__main-block');
    const nav = createNav();
    mainBlock.append(nav);
    const {wrapper, tbody} = createWrapper();
    mainBlock.append(wrapper);
    const footer = createFooter();
    mainBlock.append(footer);

    return {mainBlock, tbody};
  };

  const createRow = ({id, title, price, description, category, discont, count, units, images}) => {
    const tr = createElem('tr');
    addClass(tr, 'list-product__table-tr');

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

  const renderItems = (tbody) => {
    const allRows = window.items.map(createRow);
    tbody.append(...allRows);
  };

  const renderCRM = (app, title) => {
    const section = createSection();
    const sectionContainer = section.container;
    const header = createHeader(title);

    const {mainBlock, tbody} = createMainBlock();
    renderItems(tbody);

    sectionContainer.append(header);
    sectionContainer.append(mainBlock);


    app.append(section);
  };

  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    renderCRM(app, title);

    // const {list, logo, btnAdd, overlay, form} = crm;

    // Функционал

    // const renderItems = (list, goods) => {
    // };
    //
    // const allRow = renderItems(list, window.goods);

    // const addItem = document.querySelector('.add-item');
    // const addItemCloseButton = document.querySelector('.add-item-close-button');

    // btnAdd.addEventListener('click', () => {
    //   overlay.classList.remove('is-visible');
    // });

    // addItem.addEventListener('click', event => {
    //   event.stopPropagation();
    // });

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