import {checkFileSize} from './fileHandler.js';

export const hideImage = ($) => {
    const promise = new Promise((resolve) => {
        // const image = $.form.querySelector('.add-item__image-preview');
        const images = $.form.querySelectorAll('.add-item__image-preview');
        images?.forEach(e => e.remove());
        const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
        imagewrapper?.classList.add('hide-image');
        
        resolve(true);
    });
    
    return promise;
};

export const appendImage = (image, imagewrapper) => {
    // const preview = imagewrapper.getElementsByClassName('add-item__image-preview');
    imagewrapper.append(image);
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

export const handleLoadImage = ($, imagewrapper, fileBtn, dataPic = '') => new Promise(resolve => {
    
    const image = document.createElement('img');
    
    image.addEventListener('load', () => {
        resolve();
    });
    
    // replace, add
    if (fileBtn.files.length > 0) {
        // check size
        const file = fileBtn.files[0];
        
        if (!checkFileSize($, file, imagewrapper, () => {
            checkWindowResize($);
        })) return;
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

export const handleAddImage = async () => {
    const fileBtn = $.form.querySelector('.add-item__button-image');
    fileBtn.addEventListener('change', async ({target}) => {
        const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
        const img = imagewrapper?.querySelector('img');
        img?.remove();
        await handleLoadImage($, imagewrapper, fileBtn, null);
    });
};