
export const hideImage = ($) => {
    const image = $.form.querySelector('.add-item__image-preview');
    image?.remove();
    const imagewrapper = $.form.querySelector('.add-item__image-wrapper');
    imagewrapper?.classList.add('hide-image');
};

export const appendImage = (image, imagewrapper) => {

    const preview = imagewrapper.getElementsByClassName('add-item__image-preview');
    imagewrapper.append(image);
    image.classList.add('add-item__image-preview');
    image.alt = 'Превью изображеня';
};



export const handleLoadImage = (imagewrapper, fileBtn, dataPic = '') => new Promise(resolve => {

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