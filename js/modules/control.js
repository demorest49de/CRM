import {calculateFormTotal, handleDiscount} from './calculations.js';
import {loadModalStyles} from './loadModal.js';
import {
    sendGoodsHandler, deleteGoodsHandler, fetchAddEdit, updateItemHandler, getCategories,
} from './restOperations.js';
import {toBase64} from './toBase64.js';
import {
    handleAllValidations, countDescriptionLength, removeVisualValidation, validateInput
} from "./validation.js";
import {
    hideImage, handleLoadImage, checkWindowResize, handleImageBtn
} from "./handleImage.js";


export const handleControls = ($) => {
    const prepareModal = async (element, callback) => {
        
        await loadModalStyles('css/addItem.css').then((response) => {
            if (response && element === $.addItemBtn) {
                handleDiscount($.form.querySelector('.add-item__checkbox'), $);
                $.overlay.querySelector('.add-item__title').textContent = 'добавить товар';
                $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'добавить товар';
                $.overlay.querySelector('.add-item__id-block').style.display = `none`;
            }
            
            if (response && element.classList.contains('list-product__button-edit')) {
                const tdId = element.closest('.list-product__table-tr')
                    .querySelector('td[data-id]').getAttribute('data-id');
                
                fetchAddEdit($, tdId).then(() => {
                    
                    $.overlay.querySelector('.add-item__title').textContent = 'Изменить товар';
                    $.overlay.querySelector('button.add-item__button-item[type=submit]').textContent = 'Сохранить';
                    
                    $.overlay.querySelector('.add-item__id-block').style.display = `block`;
                    const id = $.overlay.querySelector('.vendor-code__id');
                    id.textContent = tdId;
                    
                    const dataPic = element.closest('.list-product__table-tr')
                        .querySelector('button[data-pic]')?.getAttribute('data-pic');
                    
                    if (dataPic) {
                        const fileBtn = $.form.querySelector('.add-item__button-image');
                        const imageWrapper = document.querySelector('.add-item__image-wrapper');
                        
                        imageWrapper.classList.remove('hide-image');
                        
                        if (!imageWrapper.contains(imageWrapper.querySelector('.add-item__image-preview')))
                            handleLoadImage($, imageWrapper, fileBtn, dataPic);
                    }
                });
            }
        });
    };
    
    const handleOpenForm = () => {
        $.addItemBtn.addEventListener('click', ({target}) => {
            prepareModal(target).then(() => {
                $.app.append($.overlay);
                handleAllValidations($);
            }).then(() => {
                modalAnimationHandler(400, 1, 'visible');
            });
        });
    };
    
    const handleCloseForm = () => {
        $.overlay.addEventListener('click', event => {
            const target = event.target;
            if (
                // target === $.overlay ||
                target.closest('.add-item-close-button')) {
                const wrapper = $.form.querySelector('.add-item__image-wrapper');
                const editAttr = wrapper.getAttribute("data-fromEditWindow");
                
                if (editAttr) {
                    wrapper.removeAttribute("data-fromEditWindow");
                    hideImage($, true);
                } else {
                    hideImage($);
                }
                
                
                modalAnimationHandler(400, -1, 'hidden', function () {
                    const tr = $.tbody.querySelector('.list-product__table-tr[data-is-editable=true]');
                    if (tr) {
                        removeVisualValidation($);
                        tr.removeAttribute('data-is-editable');
                        $.form.reset();
                    }
                    $.overlay.remove();
                });
            }
        });
    };
    
    const modalAnimationHandler = (duration, direction, visibility, removeOverlayCallback) => {
        const animationObject = {
            visibilityIsUsed: true,
            
            overlayAnimation: function (callback) {
                if (this.visibilityIsUsed) $.overlay.style.visibility = visibility;
                console.log(' overlay anim: ');
                modalAnimation(duration, direction, (progress) => {
                    $.overlay.style.opacity = `${progress}`;
                    // console.log(' : ', progress);
                    if (callback && progress >= 1) {
                        callback();
                    }
                });
                
            }, windowAnimation: function (callback) {
                if (this.visibilityIsUsed) $.addItemBlock.style.visibility = visibility;
                console.log(' window anim: ');
                modalAnimation(duration, direction, (progress) => {
                    $.addItemBlock.style.opacity = `${progress}`;
                    if (callback && progress <= 0) {
                        callback();
                    }
                });
            },
        };
        
        if (direction === 1) {
            animationObject.visibilityIsUsed = true;
            animationObject.overlayAnimation(() => {
                animationObject.windowAnimation();
            });
        }
        if (direction === -1) {
            animationObject.visibilityIsUsed = false;
            animationObject.windowAnimation(() => {
                animationObject.overlayAnimation(() => {
                    removeOverlayCallback();
                });
            });
        }
    };
    
    const modalAnimation = (duration, direction, callback) => {
        let requestId = NaN;
        let startAnimation = NaN;
        
        requestId = window.requestAnimationFrame(function step(timestamp) {
            startAnimation ||= timestamp;
            let progress = ((timestamp - startAnimation) / duration).toFixed(2);
            if (direction > 0) {
                callback(progress);
                if (progress < 1) {
                    requestId = requestAnimationFrame(step);
                } else {
                    cancelAnimationFrame(requestId);
                }
            } else {
                progress = (1 - progress).toFixed(2);
                callback(progress);
                if (progress > 0) {
                    requestId = requestAnimationFrame(step);
                } else {
                    cancelAnimationFrame(requestId);
                }
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
                hideImage($, true);
                $.form.querySelector('.add-item__image-wrapper').setAttribute("data-fromEditWindow", "true");
                removeVisualValidation($);
                const tr = target.closest('.list-product__table-tr');
                tr.setAttribute('data-is-editable', 'true');
                prepareModal(target).then(() => {
                    $.app.append($.overlay);
                }).then(() => {
                    modalAnimationHandler(400, 1, 'visible');
                });
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
                hideImage($, true);
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
            const imageWrapper = $.form.querySelector('.add-item__image-wrapper');
            const img = imageWrapper?.querySelector('img');
            img?.remove();
            await handleLoadImage($, imageWrapper, fileBtn, null);
        });
    };
    
    const handleRemoveImage = () => {
        const trashcan = $.form.querySelector('.add-item__trashcan');
        trashcan.addEventListener('click', ({target}) => {
            const imageWrapper = $.form.querySelector('.add-item__image-wrapper');
            const image = imageWrapper.querySelector('.add-item__image-preview');
            console.log(' : ', image);
            image.remove();
            imageWrapper?.classList.add('hide-image');
        });
    };
    
    const handleWindowsResizeForImageTextSize = () => {
        window.addEventListener('resize', () => {
            checkWindowResize($);
        });
    };
    
    const handleInput = () => {
        
        $.form.addEventListener('input', ({target}) => {
            
            countDescriptionLength($);
            
            handleAllValidations($);
        });
    };
    
    const handleDatalist = () => {
        const datalist = $.form.querySelector('#add-item__category-list');
        getCategories($).then((data) => {
            data.forEach((value) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                datalist.append(option);
            });
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
    handleRemoveImage();
    handleDatalist();
};
