import {calculateFormTotal, handleDiscount} from './calculations.js';
import {loadStylesAddItem} from './loadStyles.js';
import {
    sendGoodsHandler,
    deleteGoodsHandler,
    openEditHandler,
    updateItemHandler,
} from './restOperations.js';
import {toBase64} from './toBase64.js';

export const handleControls = ($) => {
    const hideImage = () => {
        const image = $.form.querySelector('.add-item__image-preview');
        image?.remove();
        const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
        imagewrapper?.classList.add('hide-image');
    };

    const checkWindowResize = () => {
        if (
            $.form.querySelector('.add-item__image-size-text').classList.contains('is-visible') &&
            screen.width < 822) {
            //
            $.form.querySelector('.add-item__image-text').classList.remove('remove-margin');
        } else {
            $.form.querySelector('.add-item__image-text').classList.add('remove-margin');
        }
    };

    const checkFileSize = (file, imagewrapper, callback) => {
        const mb = Math.pow(10, 6);

        if (file.size > mb) {
            $.form.querySelector('.add-item__image-size-text').classList.add('is-visible');
            imagewrapper?.classList.add('hide-image');
            callback();
            return false;
        }

        // добавляем после проверки размера
        $.form.querySelector('.add-item__image-size-text').classList.remove('is-visible');
        imagewrapper?.classList.remove('hide-image');
        callback();
        return true;
    };

    const appendImage = (image, imagewrapper) => {
        imagewrapper.append(image);
        image.classList.add('add-item__image-preview');
        image.alt = 'Превью изображеня';
    };

    const handleLoadImage = (imagewrapper, fileBtn, dataPic = '') => new Promise(resolve => {
        const image = document.createElement('img');
        image.addEventListener('load', () => {
            resolve();
        });
        // replace, add
        if (fileBtn.files.length > 0) {
            // check size
            const file = fileBtn.files[0];
            if (!checkFileSize(file, imagewrapper, checkWindowResize)) return;
            appendImage(image, imagewrapper);
            const src = URL.createObjectURL(fileBtn.files[0]);
            image.src = src;
            return;
        }

        // current
        if (dataPic) {
            appendImage(image, imagewrapper);
            imagewrapper.classList.remove('hide-image');
            image.src = dataPic;
        }
    });

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
            $.app.append($.overlay);

            $.overlay.querySelector('.add-item__title')
                .textContent = 'Изменить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]')
                .textContent = 'Сохранить';

            const dataPic = element.closest('.list-product__table-tr')
                .querySelector('button[data-pic]')?.getAttribute('data-pic');

            if (dataPic) {
                const fileBtn = $.form.querySelector('.add-item__button-image');
                const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
                await handleLoadImage(imagewrapper, fileBtn, dataPic);
            }

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
                hideImage();
                $.form.querySelector('.add-item__image-size-text').classList.remove('is-visible');
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
        $.form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const {
                name, category, measure, discount,
                description, quantity, price, image,
            } = data;

            console.log('image: ', image);
            const imageToSave = await toBase64(image);
            console.log('imageToSave: ', imageToSave);

            $.body.title = name;
            $.body.description = description;
            $.body.category = category;
            $.body.price = +price;
            $.body.discount = +discount;
            $.body.count = +quantity;
            $.body.units = measure;
            $.body.image = imageToSave;

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
            // hide red text
            $.form.querySelector('.add-item__image-size-text').classList.remove('is-visible');
            hideImage();
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
    // add new image instead of existing one
    const handleAddImage = async () => {
        const fileBtn = $.form.querySelector('.add-item__button-image');
        fileBtn.addEventListener('change', async () => {
            const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
            const img = imagewrapper?.querySelector('img');
            img?.remove();
            await handleLoadImage(imagewrapper, fileBtn);
        });
    };

    const handleWindowsResizeForImageTextSize = () => {
        window.addEventListener('resize', () => {
            checkWindowResize();
        });
    };


    const handleInput = () => {
        $.form.addEventListener('input', ({target}) => {
            if (
                target.closest('.add-item__input[name=name]') ||
                target.closest('.add-item__input[name=category]') ||
                target.closest('.add-item__input[name=description]')

                ) {
                target.value = target.value.replace(/[^А-Яа-я\s]/g, '');
            }
            if (
                target.closest('.add-item__input[name=measure]')) {
                target.value = target.value.replace(/[^А-Яа-я]/g, '');
            }
            if (
                target.closest('.add-item__input[name=quantity]') ||
                target.closest('.add-item__input[name=discount]') ||
                target.closest('.add-item__input[name=price]')

            ) {
                target.value = target.value.replace(/[^0-9]/g, '');
            }
        });
    };

    handleInput();
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
    handleWindowsResizeForImageTextSize();
};
