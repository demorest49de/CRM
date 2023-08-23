
export const checkFileSize = ($, file, imagewrapper, fileBtn, callback) => {
    const mb = Math.pow(10, 6);

    if (file.size > mb) {
        $.form.querySelector('.add-item__image-size-text').classList.add('is-visible');
        imagewrapper?.classList.add('hide-image');
        removeFileFromFileList(0, fileBtn);
        callback();
        return false;
    }
    
    const filesizeText = $.form.querySelector('.add-item__file-size');
    filesizeText.textContent = `${Math.floor(file.size/1000)} KB`;
    console.log(' : ',filesizeText);
    // добавляем после проверки размера
    $.form.querySelector('.add-item__image-size-text').classList.remove('is-visible');
    imagewrapper?.classList.remove('hide-image');
    callback();
    return true;
};

const removeFileFromFileList = (index, input) => {
    const dt = new DataTransfer();
    const {files} = input;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (index !== i)
            dt.items.add(file); // here you exclude the file. thus removing it.
    }
    input.files = dt.files; // Assign the updates list
    console.log(' : ',input.files);
};