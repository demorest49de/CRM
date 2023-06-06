import {calculateFormTotal, handleDiscount} from './calculations.js';
import {loadStylesAddItem} from './loadStyles.js';
import {
    sendGoodsHandler, deleteGoodsHandler, openEditHandler, updateItemHandler, loadGoodsHandler,
} from './restOperations.js';
import {toBase64} from './toBase64.js';


export const handleControls = ($) => {
    const removeAllNotifications = ($) => {
        $.form.querySelectorAll('.add-item__warn-text').forEach(item => {
                item.remove();
            }
        );
    };

    const hideImage = () => {
        const image = $.form.querySelector('.add-item__image-preview');
        image?.remove();
        const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
        imagewrapper?.classList.add('hide-image');
    };

    const checkWindowResize = () => {
        if ($.form.querySelector('.add-item__image-size-text').classList.contains('is-visible') && screen.width < 822) {
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
        if (!$.app.querySelector('#app .overlay')) {
            $.app.append($.overlay);
        }
        if (element === $.addItemBtn) {
            await loadStylesAddItem('css/additem.css').then(() => {
                $.overlay.classList.add('is-visible');
            });
            handleDiscount($.form.querySelector('.add-item__checkbox'), $);
            $.overlay.querySelector('.add-item__title').textContent = 'добавить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'добавить товар';
            $.overlay.querySelector('.add-item__id-block').style.display = `none`;
        }
        if (element.classList.contains('list-product__button-edit')) {
            await loadStylesAddItem('css/additem.css').then(() => {
                $.overlay.classList.add('is-visible');
            });

            $.overlay.querySelector('.add-item__title').textContent = 'Изменить товар';
            $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'Сохранить';

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

                const tr = $.tbody.querySelector('.list-product__table-tr[data-is-editable=true]');
                console.log(' : ', tr);
                if (tr) {
                    removeAllNotifications($);
                    tr.removeAttribute('data-is-editable');
                    $.form.reset();
                    $.overlay.remove();
                }

                hideImage();
                $.form.querySelector('.add-item__image-size-text').classList.remove('is-visible');
                setTimeout(() => {
                    $.overlay.classList.remove('is-visible');
                    // $.overlay.remove();
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
                removeAllNotifications($);
                const tr = target.closest('.list-product__table-tr');
                tr.setAttribute('data-is-editable', 'true');
                showModal(target);
            }
        });
    };

    const showWarnNotification = () => {
        const warnText = document.querySelector('.add-item__warn-text');
        setTimeout(() => {
            if (!warnText.classList.contains('add-item__warn-text_visible')) warnText.classList.add('add-item__warn-text_visible');
        }, 500);
    };

    const createWarnText = () => {
        const warnText = document.createElement('span');
        warnText.classList.add('add-item__warn-text');
        return warnText;
    };

    const handleNotificationSign = (target, showVerification = false, showWarning = false,) => {
        let labelBlock = null;
        if (target === document.querySelector('.add-item__input[name=discount]')) {
            labelBlock = target.parentNode.parentNode.querySelector('.add-item__subblock');
        } else {
            labelBlock = target.parentNode.querySelector('.add-item__subblock');
        }

        console.log(' : ', labelBlock);
        if (!labelBlock.querySelector('.add-item__warn-text')) {
            const warnText = createWarnText();
            labelBlock.insertAdjacentHTML('beforeend', warnText.outerHTML);
        }

        const warnText = labelBlock.querySelector('.add-item__warn-text');

        if (showVerification) {
            warnText.style.color = 'darkgreen';
        }
        showVerification ? warnText.innerHTML = '  &#10003;' : warnText.innerHTML = '';

        if (showWarning) {
            warnText.style.color = 'darkred';
            warnText.textContent = '  !!!';
        }

        setTimeout(() => {
            if (!warnText.classList.contains('add-item__warn-text_visible')) {
                warnText.classList.add('add-item__warn-text_visible');
            }
        }, 500);
    };

    const validateForm = () =>{

    }

    // написать запрос к апи метод post
    const submitFormData = () => {
        $.form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const {
                name, category, measure, discount, description, quantity, price, image,
            } = data;

            // if (description.length < 80) {
            //     handleNotificationSign();
            //     return;
            // }

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
            $.form.reset();
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
        const checkLength = (target, length) => {
            if (target.value.length >= length) {
                handleNotificationSign(target, true);
            } else {
                handleNotificationSign(target, false);
            }
            return target.value.length >= length;
        };

        $.form.addEventListener('input', ({target}) => {

            if (target === document.querySelector('.add-item__input[name=description]')) {
                const textCount = document.querySelector('.add-item__text-count');

                if (checkLength(target, 80)) {
                    textCount.textContent = '';
                } else {
                    textCount.textContent = `${target.value.length.toString()}/80`;
                }
                return;
            }

            if (target.closest('.add-item__input[name=discount]')) {
                target.value = target.value.replace(/[^0-9]/g, '');
                checkLength(target, 1);
                if (target.value > 99) {
                    handleNotificationSign(target, null, true);
                }
            }

            if (target.closest('.add-item__input[name=name]') || target.closest('.add-item__input[name=category]')) {
                target.value = target.value.replace(/[^0-9a-zA-ZА-Яа-я\s]/g, '');
                checkLength(target, 10);
            }
            if (target.closest('.add-item__input[name=measure]')) {
                target.value = target.value.replace(/[^a-zA-ZА-Яа-я]/g, '');
                checkLength(target, 2);
            }
            if (target.closest('.add-item__input[name=quantity]') || target.closest('.add-item__input[name=price]')) {
                target.value = target.value.replace(/[^0-9]/g, '');
                checkLength(target, 1);
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
    handleAddImage().then(() => {
    });
    closeErrorHandler();
    handleWindowsResizeForImageTextSize();
};
