import {handleDiscount, calculateTotal} from "./calculations.js";
import {createId, createRow} from "./createElement.js";
import {getStorage, saveStorage} from "./serviceStorage.js";
import {renderItems} from "./render.js";


const handleOpenForm = ($) => {
  $.addItemBtn.addEventListener('click', () => {
    $.form.reset();
    $.form.discount.setAttribute('disabled', '');
    $.overlay.querySelector('.add-item__title').textContent = 'добавить товар';
    $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'добавить товар';
    $.overlay.classList.add('is-visible');
    const id = $.overlay.querySelector('.vendor-code__id');
    id.textContent = createId();
  });
};

const handleCloseForm = ($) => {
  $.overlay.addEventListener('click', event => {
    const target = event.target;
    if (target === $.overlay || target.closest('.add-item-close-button')) {
      $.overlay.classList.remove('is-visible');
    }

    if (target.closest('.add-item__checkbox')) {
      handleDiscount(target);
    }
  });
};

const deleteRow = ($) => {

  $.tbody.addEventListener('click', e => {
    const target = e.target;

    if (target.closest('.list-product__button-delete')) {
      const item = target.closest('.list-product__table-tr');
      const id = item.querySelector('.list-product__table-td[data-id]').getAttribute('data-id');
      const storage = getStorage($.title);
      const data = storage.data;
      storage.data = data.filter(x => x.id !== id);
      saveStorage(storage, $.title);
      target.closest('.list-product__table-tr').remove();
    }
    calculateTotal($);
  });
};

const SubmitFormData = ($) => {
  $.form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);


    const storage = getStorage($.title);
    const {name, category, measure, discount, description, quantity, price, image} = data;
    if ($.form.querySelector('.add-item__block-id').getAttribute('data-id')) {
      const id = $.form.querySelector('.add-item__block-id').getAttribute('data-id');
      $.form.querySelector('.add-item__block-id').removeAttribute('data-id');

      const result = storage.data.map(item => {
        if (item.id === id) {
          item.category = category;
          item.count = quantity;
          item.description = description;
          item.discont = discount;
          item.images = {'small': `/upload/${image.name}`, 'big': `/upload/${image.name}`,};
          item.price = price;
          item.title = name;
          item.units = measure;
        }

        return item;
      });

      storage.data = result;
      renderItems(storage, $);
    } else {
      const id = $.overlay.querySelector('.vendor-code__id');
      console.log(': ', data, image);
      const rowData = {
        id: id.textContent,
        title: name,
        price,
        description,
        category,
        discont: discount,
        count: quantity,
        units: measure,
        images: {
          small: `/upload/${image.name}`,
          big: `/upload/${image.name}`,
        },
      };
      const row = createRow(rowData);
      storage.data.push(rowData);
      $.tbody.append(row);
    }

    //discount сброс  поля в disabled
    const input = $.form.querySelector('#add-item__discount');
    input.setAttribute('disabled', '');

    saveStorage(storage, $.title);
    $.form.reset();
    $.overlay.classList.remove('is-visible');
    calculateTotal($);
  });
};

const editRow = ($) => {
  $.tbody.addEventListener('click', e => {
    const target = e.target;
    if (target.closest('.list-product__button-edit')) {
      $.overlay.classList.add('is-visible');

      $.overlay.querySelector('.add-item__title').textContent = 'Изменить товар';
      $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'Сохранить';

      const tdId = target.closest('.list-product__table-tr').querySelector('td[data-id]').getAttribute('data-id');

      const id = $.overlay.querySelector('.vendor-code__id');
      id.textContent = tdId;

      const storage = getStorage($.title);
      const data = storage.data;

      for (let i = 0; i < data.length; i++) {
        if (data[i].id === tdId) {
          $.form.querySelector('.add-item__block-id').setAttribute('data-id', data[i].id);
          $.form.name.value = data[i].title;
          $.form.measure.value = data[i].units;
          $.form.category.value = data[i].category;
          if (data[i].discont) {
            $.form.discount.removeAttribute('disabled', '');
            $.form.discount.value = data[i].discont;
            $.form.querySelector('.add-item__checkbox').checked = 'true';
          }
          $.form.description.value = data[i].description;
          $.form.quantity.value = data[i].count;
          $.form.price.value = data[i].price;
          return;
        }
      }
    }
  });
};

// handle blur when loosing focus from price input field
const handleBlur = ($) => {
  handleBlurElement($.form.price, $);
  handleBlurElement($.form.quantity, $);
  handleBlurElement($.form.discount, $);
};

const handleBlurElement = (element, $) => {
  element.addEventListener('blur', e => {
    const discont = $.form.discount.value;
    const price = $.form.price.value;
    const count = $.form.quantity.value;
    const result = Math.floor(+price * +count * (1 - (+discont ? +discont / 100 : 0)));
    const total = $.overlay.querySelector('.add-item__total-value');
    total.textContent = result.toString();
  });
};

export default {
  handleOpenForm,
  handleCloseForm,
  deleteRow,
  SubmitFormData,
  handleBlur,
  editRow
};