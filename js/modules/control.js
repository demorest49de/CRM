import {calculateTotal, calculateFormTotal, handleDiscount} from './calculations.js';
import {createRow} from './createElement.js';
import {renderItems} from './render.js';
import {sendGoodsHandler} from './restOperations.js';


export const handleControls = ($) => {

    const handleOpenForm = () => {
        $.addItemBtn.addEventListener('click', () => {
            handleDiscount($.form.querySelector('.add-item__checkbox'), $);
            $.overlay.querySelector('.add-item__title')
                .textContent = 'добавить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]')
                .textContent = 'добавить товар';
            $.overlay.classList.add('is-visible');
            $.overlay.querySelector('.add-item__id-block').style.display = `none`;
        });
    };

    const handleCloseForm = () => {
        $.overlay.addEventListener('click', event => {
            const target = event.target;
            if (target === $.overlay || target.closest('.add-item-close-button')) {
                $.overlay.classList.remove('is-visible');
                $.form.reset();
            }
        });
    };

    const deleteRow = () => {
        $.tbody.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.list-product__button-delete')) {
                const item = target.closest('.list-product__table-tr');
                const id = item.querySelector('.list-product__table-td[data-id]')
                    .getAttribute('data-id');

                // написать запрос к апи метод delete
                const data = storage.data;
                storage.data = data.filter(x => x.id !== id);
                // saveStorage(storage, $.title);
                target.closest('.list-product__table-tr').remove();
            }
            calculateTotal($);
        });
    };

    const editRow = () => {
        $.tbody.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.list-product__button-edit')) {
                $.overlay.classList.add('is-visible');

                $.overlay.querySelector('.add-item__title')
                    .textContent = 'Изменить товар';
                $.overlay.querySelector('button.add-item__button-item[type=submit]')
                    .textContent = 'Сохранить';

                const tdId = target.closest('.list-product__table-tr')
                    .querySelector('td[data-id]').getAttribute('data-id');

                const id = $.overlay.querySelector('.vendor-code__id');
                id.textContent = tdId;
                console.log(' : ',tdId);


                // написать запрос к апи метод put
                // const data = storage.data;

                // for (let i = 0; i < data.length; i++) {
                //     if (data[i].id === tdId) {
                //         $.form.querySelector('.add-item__block-id')
                //             .setAttribute('data-id', data[i].id);
                //         $.form.name.value = data[i].title;
                //         $.form.measure.value = data[i].units;
                //         $.form.category.value = data[i].category;
                //         if (data[i].discont) {
                //             $.form.discount.removeAttribute('disabled', '');
                //             $.form.discount.value = data[i].discont;
                //             $.form.querySelector('.add-item__checkbox').checked = 'true';
                //         } else {
                //             $.form.discount.setAttribute('disabled', '');
                //         }
                //         $.form.description.value = data[i].description;
                //         $.form.quantity.value = data[i].count;
                //         $.form.price.value = data[i].price;
                //         calculateFormTotal($);
                //         return;
                //     }
                // }
            }
        });
    };

    // написать запрос к апи метод post
    const submitFormData = () => {
        $.form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const {
                name, category, measure, discount,
                description, quantity, price, image
            } = data;
            console.log(' : ',name, category, measure, discount,
                description, quantity, price, image);
            // already has item
            if ($.form.querySelector('.add-item__block-id')
                .getAttribute('data-id')) {
                const id = $.form.querySelector('.add-item__block-id')
                    .getAttribute('data-id');

                $.form.querySelector('.add-item__block-id')
                    .removeAttribute('data-id');

                const result = storage.data.map(item => {
                    if (item.id === id) {
                        item.category = category;
                        item.count = quantity;
                        item.description = description;
                        item.discont = discount;
                        item.images = image.name ? {
                            'small': `/upload/${image.name}`,
                            'big': `/upload/${image.name}`,
                        } : item.images;
                        item.price = price;
                        item.title = name;
                        item.units = measure;
                    }

                    return item;
                });

                storage.data = result;
                renderItems(storage, $);
            } else {// new item

                const body = {
                    title: name,
                    description: description,
                    category: category,
                    price: price,
                    units: measure,
                    count: quantity,
                    discount: discount,
                    image: image.name || undefined,
                };
                sendGoodsHandler(body, $);
            }

            $.form.reset();
            $.overlay.classList.remove('is-visible');
            calculateTotal($);
        });
    };

    const handleAddItemCheckbox = () => {
        $.form.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.add-item__checkbox[type=checkbox]')) {
                handleDiscount(target, $);
            }
        });
    };

    const handleBlurElement = (element) => {
        element.addEventListener('blur', () => {
            calculateFormTotal($);
        });
    };

// handle blur when loosing focus from price input field
    const handleBlur = () => {
        handleBlurElement($.form.price);
        handleBlurElement($.form.quantity);
        handleBlurElement($.form.discount);
    };

    const handleListProductImageBtn = () => {
        $.tbody.addEventListener('click', e => {
            const target = e.target;
            const imageBtn = target.closest('.list-product__table-btn.list-product__button-img');
            if (target === imageBtn) {
                const width = 700;
                const height = 700;
                const x = screen.width / 2 - width / 2;
                const y = screen.height / 2 - height / 2;
                const url = target.getAttribute('data-pic');
                const win = open(url, '', `width=${width},height=${height}`);
                win.moveBy(x, y);
            }
        });
    };

    handleOpenForm();
    handleCloseForm();
    editRow();
    deleteRow();
    submitFormData();
    handleAddItemCheckbox();
    handleBlur();
    handleListProductImageBtn();
};