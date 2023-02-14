import {handleDiscount, calculateTotal} from "./calculations.js";
import {createId, createRow} from "./createElement.js";
import {getStorage, saveStorage} from "./serviceStorage.js";
import {renderItems} from "./render.js";


const handleOpenForm = ($) => {
  $.addItemBtn.addEventListener('click', () => {
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

  $.overlay.addEventListener('click', e => {
    const target = e.target;

    if (target.closest('.list-product__button-delete')) {
      const forDelId = target.closest('.list-product__table-tr').children[0].textContent;
      const items = window.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === +forDelId) {
          items.splice(i, 1);
        }
      }

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
    const input = $.form.querySelector('#add-item__discount');
    input.setAttribute('disabled', '');
    const {name, category, measure, discount, description, quantity, price} = data;
    const id = $.overlay.querySelector('.vendor-code__id');
    const rowData = {
      id: id.textContent,
      title: name,
      price,
      description,
      category,
      discont: discount,
      count: quantity,
      units: measure
    };
    const row = createRow(rowData);
    const storage = getStorage($.title);
    storage.data.push(rowData);
    saveStorage(storage, $.title);
    $.tbody.append(row);
    renderItems(storage, $);
    $.form.reset();
    $.overlay.classList.remove('is-visible');
    calculateTotal($);
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
    const result = Math.floor(+price * +count * (1 - (+discont ? +discont / 100 : +discont)));
    const total = $.overlay.querySelector('.add-item__total-value');
    total.textContent = result.toString();
  });
};

export default {
  handleOpenForm,
  handleCloseForm,
  deleteRow,
  SubmitFormData,
  handleBlur
};