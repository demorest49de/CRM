import {calculateFormTotal, handleDiscount} from './calculations.js';
import {loadModalStyles} from './loadModal.js';
import {
    sendGoodsHandler,
    deleteGoodsHandler,
    fetchAddEdit,
    updateItemHandler, loadGoodsHandler,
} from './restOperations.js';
import {toBase64} from './toBase64.js';
import {
    handleAllValidations,
    countDescriptionLength,
    removeVisualValidation,
    validateInput
} from "./validation.js";
import {
    hideImage,
    handleLoadImage,
    checkWindowResize,
    handleImageBtn
} from "./handleImage.js";


export const handleControls = ($) => {
    
    const showModal = async (element) => {
        
        $.overlay.classList.add('is-visible');
        
        await loadModalStyles('css/additem.css').then((response) => {
            if (response && element === $.addItemBtn) {
                handleDiscount($.form.querySelector('.add-item__checkbox'), $);
                $.overlay.querySelector('.add-item__title').textContent = 'добавить товар';
                $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'добавить товар';
                $.overlay.querySelector('.add-item__id-block').style.display = `none`;
            }
            
            if (response && element.classList.contains('list-product__button-edit')) {
                const tdId = element.closest('.list-product__table-tr')
                    .querySelector('td[data-id]').getAttribute('data-id');
                
                fetchAddEdit($, tdId).then((result) => {
                    console.log(' : ', result);
                    $.overlay.querySelector('.add-item__title').textContent = 'Изменить товар';
                    $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'Сохранить';
                    
                    $.overlay.querySelector('.add-item__id-block').style.display = `block`;
                    const id = $.overlay.querySelector('.vendor-code__id');
                    id.textContent = tdId;
                }).then(() => {
                    const dataPic = element.closest('.list-product__table-tr')
                        .querySelector('button[data-pic]')?.getAttribute('data-pic');
                    
                    if (dataPic) {
                        const fileBtn = $.form.querySelector('.add-item__button-image');
                        const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
                        
                        handleLoadImage($, imagewrapper, fileBtn, dataPic).then(() => {
                            $.app.append($.overlay);
                        });
                    }
                });
            }
        });
        
        // //add
        // if (element === $.addItemBtn) {
        //     handleDiscount($.form.querySelector('.add-item__checkbox'), $);
        //     $.overlay.querySelector('.add-item__title').textContent = 'добавить товар';
        //     $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'добавить товар';
        //     $.overlay.querySelector('.add-item__id-block').style.display = `none`;
        // }
        //edit
        // if (element.classList.contains('list-product__button-edit')) {
        //
        //     $.overlay.querySelector('.add-item__title').textContent = 'Изменить товар';
        //     $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'Сохранить';
        //
        //     const dataPic = element.closest('.list-product__table-tr')
        //         .querySelector('button[data-pic]')?.getAttribute('data-pic');
        //
        //     if (dataPic) {
        //         const fileBtn = $.form.querySelector('.add-item__button-image');
        //         const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
        //
        //         await handleLoadImage($, imagewrapper, fileBtn, dataPic);
        //     }
        //
        //     const tdId = element.closest('.list-product__table-tr')
        //         .querySelector('td[data-id]').getAttribute('data-id');
        //
        //     $.overlay.querySelector('.add-item__id-block').style.display = `block`;
        //     const id = $.overlay.querySelector('.vendor-code__id');
        //     id.textContent = tdId;
        //
        //     openEditHandler($, tdId);
        //}
    };
    
    const handleOpenForm = () => {
        $.addItemBtn.addEventListener('click', ({target}) => {
            showModal(target).then(() => {
                $.app.append($.overlay);
                handleAllValidations($);
            });
        });
    };
    
    const handleCloseForm = () => {
        // дождаться закрытия формы
        $.overlay.addEventListener('click', event => {
            const target = event.target;
            if (target === $.overlay || target.closest('.add-item-close-button')) {
                
                const tr = $.tbody.querySelector('.list-product__table-tr[data-is-editable=true]');
                if (tr) {
                    removeVisualValidation($);
                    tr.removeAttribute('data-is-editable');
                    $.form.reset();
                }
                
                hideImage($);
                $.overlay.remove();
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
                
                
                deleteGoodsHandler($, id);
            }
        });
    };
    
    const editRow = () => {
        $.tbody.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.list-product__button-edit')) {
                removeVisualValidation($);
                const tr = target.closest('.list-product__table-tr');
                tr.setAttribute('data-is-editable', 'true');
                showModal(target);
            }
        });
    };
    
    const submitFormData = () => {
        $.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const {
                name, category, measure, discount, description, quantity, price, image,
            } = data;
            
            validateInput($).then(async (result) => {
                if (!image.name) {
                    delete $.body.image;
                } else {
                    await toBase64(image).then(blob => $.body.image = blob);
                }
                
                $.body.title = name;
                $.body.description = description;
                $.body.category = category;
                $.body.price = +price;
                $.body.discount = +discount;
                $.body.count = +quantity;
                $.body.units = measure;
                
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
                removeVisualValidation($);
                
                $.overlay.remove();
                hideImage($);
            }).catch((error) => {
                console.log(' : ', error);
            });
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
    
    const handleBlur = () => {
        handleBlurElement($.form.price);
        handleBlurElement($.form.quantity);
        handleBlurElement($.form.discount);
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
    
    const handleAddImage = async () => {
        const fileBtn = $.form.querySelector('.add-item__button-image');
        fileBtn.addEventListener('change', async ({target}) => {
            const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
            const img = imagewrapper?.querySelector('img');
            img?.remove();
            await handleLoadImage($, imagewrapper, fileBtn, null);
        });
    };
    
    const handleWindowsResizeForImageTextSize = () => {
        window.addEventListener('resize', () => {
            checkWindowResize();
        });
    };
    
    const handleInput = () => {
        
        $.form.addEventListener('input', ({target}) => {
            
            countDescriptionLength($);
            
            handleAllValidations($);
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
    handleImageBtn($);
    handleAddImage().then(() => {
    });
    closeErrorHandler();
    handleWindowsResizeForImageTextSize();
};
