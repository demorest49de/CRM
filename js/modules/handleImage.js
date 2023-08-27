import {checkFileSize} from './fileHandler.js';


export const hideImage = ($, remove = false) => {
    
    // const images = $.form.querySelectorAll('.add-item__image-preview');
    const images = document.querySelectorAll('.add-item__image-preview');
    if (remove) {
        images.forEach(e => e.remove());
        const imageWrapper = $.form.querySelector('.add-item__image-wrapper');
        imageWrapper?.classList.add('hide-image');
        $.form.querySelector('.add-item__file-size').textContent = '';
    }
};

export const appendImage = (image, imageWrapper) => {
    
    imageWrapper.append(image);
    image.classList.add('add-item__image-preview');
    image.alt = 'Превью изображеня';
};

export const checkWindowResize = ($) => {
    if ($.form.querySelector('.add-item__image-size-text').classList.contains('is-visible') && screen.width < 822) {
        $.form.querySelector('.add-item__image-text').classList.remove('remove-margin');
    } else {
        $.form.querySelector('.add-item__image-text').classList.add('remove-margin');
    }
};

export const handleLoadImage = ($, imageWrapper, fileBtn, dataPic = '') => new Promise(resolve => {
    
    const image = document.createElement('img');
    
    image.addEventListener('load', async () => {
        resolve();
    });
    
    // replace, add
    if (fileBtn.files.length > 0) {
        // check size
        const file = fileBtn.files[0];
        
        if (!checkFileSize($, file, imageWrapper, fileBtn, () => {
            checkWindowResize($);
        })) return;
        appendImage(image, imageWrapper);
        const src = URL.createObjectURL(fileBtn.files[0]);
        image.src = src;
        return;
    }
    
    // current
    if (dataPic) {
        appendImage(image, imageWrapper);
        imageWrapper.classList.remove('hide-image');
        image.src = dataPic;
    }
});

export const handleImageBtn = ($) => {
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