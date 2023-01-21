'use strict';


{
  const addClass = (element, tokens) => {
    element.classList.add(...tokens);
  };

  const createContainer = () => {
    const container = document.createElement('div');
    addClass(container, ['container']);
    return container;
  };

  const createSection = () => {
    const section = document.createElement('section');
    addClass(section, ['list-product']);
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
    addClass(cardSumPrice, ['card-sum__price']);
    cardSumPrice.textContent = `$0.00`;
    titleSum.append(cardSumPrice);
    return titleSum;
  };

  const createHeader = (title) => {
    const header = document.createElement('div');
    addClass(header, ['list-product__header']);
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
    addClass(navBlock, ['nav__block']);
    nav.append(navBlock);

    const filterBtn = createElem('button');
    addClass(filterBtn, ['nav__filter-btn']);
    filterBtn.textContent = 'Фильтр';
    navBlock.append(filterBtn);

    const form = createElem('form');
    addClass(form, ['nav__search']);
    form.insertAdjacentHTML('beforeend',
      `
        <input class="nav__input" type="search" placeholder="Поиск по наименованию и категории">      
      `);
    navBlock.append(form);

    const addItemBtn = createElem('button');
    addClass(addItemBtn, ['nav__add-btn']);
    addItemBtn.textContent = 'Добавить товар';
    navBlock.append(addItemBtn);

    return {nav, addItemBtn};
  };

  const createWrapper = () => {
    const wrapper = createElem('div');
    addClass(wrapper, ['list-product__wrapper']);
    const table = createElem('table');
    addClass(table, ['list-product__table']);
    wrapper.append(table);
    const thead = createElem('thead');
    addClass(thead, ['list-product__table-head']);
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
    addClass(tbody, ['list-product__table-body']);
    table.append(thead, tbody);
    table.tbody = tbody;
    return {
      tbody,
      wrapper
    };
  };

  const createFooter = () => {
    const footer = createElem('div');
    addClass(footer, ['list-product__footer']);
    footer.insertAdjacentHTML('beforeend',
      `
        <div class="list-product__footer">
          <div class="list-product__footer-block">
            <div class="list-product__footer-sub-block">
              <span class="list-product__footer-span">Показывать на странице:</span>
              <select class="list-product__select-page">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="5">5</option>
              </select>
            </div>
            <div class="list-product__pages">
              <div class="list-product__pages-displayed">1-5 of</div>
              <div class="list-product__total-pages">25</div>
            </div>
            <button class="list-product__arrow-pages list-product__prev-page" aria-label="left"></button>
            <button class="list-product__arrow-pages list-product__next-page" aria-label="right"></button>
          </div>
        </div>
      `);
    return footer;
  };

  const createMainBlock = () => {
    const mainBlock = createElem('div');
    addClass(mainBlock, ['list-product__main-block']);
    const {nav, addItemBtn} = createNav();
    mainBlock.append(nav);
    const {wrapper, tbody} = createWrapper();
    mainBlock.append(wrapper);
    const footer = createFooter();
    mainBlock.append(footer);

    return {mainBlock, tbody, addItemBtn};
  };

  const createRow = ({id, title, price, description, category, discont, count, units, images}) => {
    const tr = createElem('tr');
    addClass(tr, ['list-product__table-tr']);

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


  const createOverlay = () => {
    const overlay = createElem('div');
    addClass(overlay, ['overlay']);
    const addItemBlock = createElem('div');
    addClass(addItemBlock, ['add-item']);
    const addItemContainer = createElem('div');
    addClass(addItemContainer, ['add-item__container']);
    addItemContainer.insertAdjacentHTML('beforeend', `
        <h1 class="add-item__title">добавить товар</h1>
        <div class="add-item__line"></div>
        <form class="add-item__form" action="https://jsonplaceholder.typicode.com/posts" name="add-item__form"
          id="add-item__form" method="post">
          <fieldset class="add-item__content">
            <div class="add-item__block add-item__name">
              <label class="add-item__label" for="add-item__name">
                наименование
              </label>
              <input class="add-item__input" type="text" name="name" id="add-item__name" required>
            </div>
          
            <div class="add-item__block add-item__category">
              <label class="add-item__label" for="add-item__category">
                категория
              </label>
              <input class="add-item__input" type="text" name="category" id="add-item__category" required>
            </div>
          
            <div class="add-item__block add-item__measure">
              <label class="add-item__label" for="add-item__measure">
                еденицы измерения
              </label>
              <input class="add-item__input" type="text" name="measure" id="add-item__measure" required>
            </div>
          
            <div class="add-item__discount">
              <label class="add-item__label" for="add-item__discount">дисконт</label>
              <div class="add-item__input-set">
                <input class="add-item__checkbox" type="checkbox">
                <input class="add-item__input" type="text" name="discount" id="add-item__discount"
                  disabled required>
              </div>
            </div>  
          
            <div class="add-item__block add-item__description">
              <label class="add-item__label" for="add-item__description">описание</label>
              <textarea class="add-item__input" rows="5" name="description" 
              id="add-item__description"></textarea>
            </div>
          
            <div class="add-item__block add-item__quantity"><label class="add-item__label" 
              for="add-item__quantity">количество</label>
              <input class="add-item__input" type="number" name="quantity" id="add-item__quantity"
              required>
            </div>
          
            <div class="add-item__block add-item__price">
              <label class="add-item__label" for="add-item__price">
                цена
              </label>
              <input class="add-item__input" type="number" name="price" id="add-item__price" required>
            </div>
          
            <div class="add-item__add-image-button">
              <label class="add-item__label-add-image" for="add-item__button-image">добавить
                изображение</label>
              <input class="add-item__button add-item__button-image" type="file"
                id="add-item__button-image"
                name="image"
                accept="image/jpeg, image/png">
            </div>
          </fieldset>
        </form>
    `);
    const addItemCheckbox = addItemContainer.querySelector('.add-item__checkbox');

    const addItemTotalBlock = createElem('div');
    addClass(addItemTotalBlock, ['add-item__total-block']);

    addItemTotalBlock.insertAdjacentHTML('beforeend', `
      <p class="add-item__total">
        <span class="add-item__total-text">Итоговая стоимость: </span>
        <span class="add-item__total-value">$ 0.00</span>
      </p>
    `);

    const addItemFormBtn = createElem('button');
    addClass(addItemFormBtn, ['add-item__button', 'add-item__button-item']);
    addItemFormBtn.type = 'submit';
    addItemFormBtn.textContent = 'добавить товар';
    addItemFormBtn.setAttribute('form', 'add-item__form');

    const addItemCloseBtn = createElem('button');
    addClass(addItemCloseBtn, ['add-item-close-button']);
    addItemCloseBtn.type = 'button';
    addItemCloseBtn.insertAdjacentHTML('beforeend', `
      <svg width="20" height="20" viewbox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L22 22" stroke="#6E6893" stroke-width="3" stroke-linecap="round"/>
        <path d="M2 22L22 2" stroke="#6E6893" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `);

    addItemTotalBlock.append(addItemFormBtn);
    addItemContainer.append(addItemTotalBlock);
    addItemBlock.append(addItemContainer);
    addItemBlock.append(addItemCloseBtn);
    overlay.append(addItemBlock);

    return {overlay, discount: addItemCheckbox};
  };

  const renderCRM = (app, title) => {
    const section = createSection();
    const sectionContainer = section.container;
    const header = createHeader(title);

    const {mainBlock, tbody, addItemBtn} = createMainBlock();
    renderItems(tbody);

    sectionContainer.append(header);
    sectionContainer.append(mainBlock);

    const {overlay, discount} = createOverlay();

    app.append(section, overlay);

    return {addItemBtn, overlay, items: tbody, discount};
  };

  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);

    const {addItemBtn, overlay, items, discount} = crm;

    // Функционал

    addItemBtn.addEventListener('click', () => {
      overlay.classList.add('is-visible');
    });

    overlay.addEventListener('click', event => {
      const target = event.target;
      if (target === overlay || target.closest('.add-item-close-button')) {
        overlay.classList.remove('is-visible');
      }

      if (target.closest('.add-item__checkbox')) {
        handleDiscount(target);
      }
    });

    const handleDiscount = (target) => {
      const input = target.parentElement.querySelector('.add-item__input');
      if (target.checked) {
        input.removeAttribute('disabled');
      } else {
        input.value = '';
        input.setAttribute('disabled', '');
      }
    };

    items.addEventListener('click', e => {
      const target = e.target;

      if (target.closest('.list-product__button-delete')) {
        const forDelId = target.closest('.list-product__table-tr').children[0].textContent;
        const items = window.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === +forDelId) {
            items.splice(i, 1);
            console.log('items: ', window.items);
          }
        }

        target.closest('.list-product__table-tr').remove();
      }
    });

  };

  window.listProductInit = init;
}