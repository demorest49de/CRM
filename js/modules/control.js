import {calculateFormTotal, handleDiscount} from './calculations.js';
import {sendGoodsHandler, deleteGoodsHandler, editGoodHandler} from './restOperations.js';


export const handleControls = ($) => {

    const removeDataChangedAttribute = () => {
        $.formContent.forEach(item => {
            item.removeAttribute('data-changed');
        });
    };

    const getChangedFormFields = () => {
        const changed = document.querySelectorAll('.add-item__content input:not(.add-item__checkbox), #add-item__description');
        changed.forEach(item => {
            console.log(' : ', item.value);
        });
        return changed;
    };

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
                removeDataChangedAttribute();
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
                deleteGoodsHandler(id, $);
            }
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

                $.overlay.querySelector('.add-item__id-block').style.display = `block`;

                const id = $.overlay.querySelector('.vendor-code__id');
                id.textContent = tdId;
                editGoodHandler(tdId, $);
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

            // exist item - put
            if ($.form.querySelector('.add-item__block-id')
                .getAttribute('data-id')) {
                const id = $.form.querySelector('.add-item__block-id')
                    .getAttribute('data-id');

                $.form.querySelector('.add-item__block-id')
                    .removeAttribute('data-id');

                const body = getChangedFormFields();
                // const body = storage.data.map(item => {
                //     if (item.id === id) {
                //         item.category = category;
                //         item.count = quantity;
                //         item.description = description;
                //         item.discont = discount;
                //         item.images = image.name ? {
                //             'small': `/upload/${image.name}`,
                //             'big': `/upload/${image.name}`,
                //         } : item.images;
                //         item.price = price;
                //         item.title = name;
                //         item.units = measure;
                //     }
                //
                //     return item;
                // });

                // updateGoodsHandler(body, $, id);
            } else {
                // new item - post
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

            removeDataChangedAttribute();
            $.form.reset();
            $.overlay.classList.remove('is-visible');
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

    const checkInputChanges = () => {
        $.formContent.forEach(item => {
            console.log(' : ', item);
            item.addEventListener('change', ({target}) => {
                target.setAttribute('data-changed', 'true');
            });
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
    checkInputChanges();
};