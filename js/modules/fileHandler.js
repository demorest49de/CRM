
export const checkFileSize = ($, file, imagewrapper, callback) => {
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