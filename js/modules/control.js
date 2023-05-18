import {calculateFormTotal, handleDiscount} from './calculations.js';
import {loadStylesAddItem} from './loadStyles.js';
import {
    sendGoodsHandler,
    deleteGoodsHandler,
    openEditHandler,
    updateItemHandler,
} from './restOperations.js';


export const handleControls = ($) => {

    const showModal = async (element) => {
        console.log(' : ', element);
        if (element === $.addItemBtn) {
            await loadStylesAddItem('css/additem.css');
            $.app.append($.overlay);
            handleDiscount($.form.querySelector('.add-item__checkbox'), $);
            $.overlay.querySelector('.add-item__title')
                .textContent = 'добавить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]')
                .textContent = 'добавить товар';
            $.overlay.querySelector('.add-item__id-block').style.display = `none`;
            setTimeout(() => {
                $.overlay.classList.add('is-visible');
            }, 300);
        }
        if (element.classList.contains('list-product__button-edit')) {
            await loadStylesAddItem('css/additem.css');
            // по уроку 6.9 переделать: нужно что бы оверлей появлялся после разрешения промиса те есть когда
            // выполнится get по id
            $.app.append($.overlay);

            $.overlay.querySelector('.add-item__title')
                .textContent = 'Изменить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]')
                .textContent = 'Сохранить';

            const tdId = element.closest('.list-product__table-tr')
                .querySelector('td[data-id]').getAttribute('data-id');

            $.overlay.querySelector('.add-item__id-block').style.display = `block`;
            const id = $.overlay.querySelector('.vendor-code__id');
            id.textContent = tdId;

            setTimeout(() => {
                $.overlay.classList.add('is-visible');
            }, 300);
            openEditHandler($, tdId);
        }
    };

    const handleOpenForm = () => {
        $.addItemBtn.addEventListener('click', ({target}) => {
            showModal(target);
        });
    };

    const handleCloseForm = () => {
        $.overlay.addEventListener('click', event => {
            const target = event.target;
            if (target === $.overlay || target.closest('.add-item-close-button')) {
                $.overlay.classList.remove('is-visible');
                setTimeout(() => {
                    $.overlay.remove();
                    $.form.reset();
                }, 300);
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
                deleteGoodsHandler($, id);
            }
        });
    };

    const editRow = () => {
        $.tbody.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.list-product__button-edit')) {
                showModal(target);
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

            $.body.title = name;
            $.body.description = description;
            $.body.category = category;
            $.body.price = +price;
            $.body.discount = +discount;
            $.body.count = +quantity;
            $.body.units = measure;
            $.body.image = image.name;

            // exist item - put
            if ($.form.querySelector('.add-item__block-id')
                .getAttribute('data-id')) {
                const id = $.form.querySelector('.add-item__block-id')
                    .getAttribute('data-id');

                $.form.querySelector('.add-item__block-id')
                    .removeAttribute('data-id');

                updateItemHandler($.body, $, id);
            } else {
                // new item - post

                sendGoodsHandler($.body, $);
            }
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

    const handleImageBtn = () => {
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


    const closeErrorHandler = () => {
        const closeBtn = $.addItemError.querySelector('.add-item-close-button');
        closeBtn.addEventListener('click', () => {
            $.overlay.classList.remove('is-visible');
            $.addItemError.classList.remove('is-visible');
            $.form.reset();
            setTimeout(() => {
                $.addItemError.remove();
            }, 500);

        });
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });
        reader.addEventListener('error', err => {
            reject(err);
        });

        reader.readAsDataURL(file);
    });

    const handleAddImage = () => {
        const fileBtn = $.form.querySelector('.add-item__button-image');
        fileBtn.addEventListener('change', async () => {
            const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
            const img = imagewrapper.querySelector('img');
            if (img) img.remove();
            imagewrapper.classList.remove('hide-image');
            const image = document.createElement('img');
            imagewrapper.append(image);
            image.alt = 'Превью изображеня';
            if (fileBtn.files.length > 0) {
                // const src = URL.createObjectURL(fileBtn.files[0]);
                const result = await toBase64(fileBtn.files[0]);
                image.src = result;

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
    handleImageBtn();
    handleAddImage();
    closeErrorHandler();
};