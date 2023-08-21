const createWarnText = () => {
    const warnText = document.createElement('span');
    warnText.classList.add('add-item__warn-text');
    return warnText;
};

export const handleAllValidations = ($) => {
    console.log(' : ',$.form);
    const isDiscountValidated = handleDiscountValidation($);

    const name = $.form.querySelector('.add-item__input[name=name]');
    const category = $.form.querySelector('.add-item__input[name=category]');
    const measure = $.form.querySelector('.add-item__input[name=measure]');
    const price = $.form.querySelector('.add-item__input[name=price]');
    const quantity = $.form.querySelector('.add-item__input[name=quantity]');
    const description = $.form.querySelector('.add-item__input[name=description]');

    let isFieldNotValidated = 0;

    const validatePriceQuanity = (target) => {
        target.value = target.value.replace(/([^0-9])/g, '');
        if (target.value > 0) {
            handleCheckLength(target, 1, $);
        } else {
            handleNotificationSign(target, false, true, $);
            isFieldNotValidated++;
        }
    };

    const validateNameCategory = (target) => {
        target.value = target.value.replace(/[^0-9a-zA-ZА-Яа-я\s]/g, '');
        if (!handleCheckLength(target, 10, $)) isFieldNotValidated++;
    };

    for (const target of Array.from([name, category, measure, price, quantity, description])) {
        if (target.value != '') {


            if (target === description) {
                if (!handleCheckLength(target, 80, $)) isFieldNotValidated++;
                continue;
            }

            if (target === measure) {
                target.value = target.value.replace(/[^a-zA-ZА-Яа-я]/g, '');
                if (!handleCheckLength(target, 2, $)) isFieldNotValidated++;
                continue;
            }

            if (target === price) {
                validatePriceQuanity(target);
                continue;
            }

            if (target === quantity) {
                validatePriceQuanity(target);
                continue;
            }

            if (target === name) {
                validateNameCategory(target);
                continue;
            }

            if (target === category) {
                validateNameCategory(target);
                continue;
            }

        } else {
            handleNotificationSign(target, false, false);
        }
    }

    const isALLFieldsValidated = isDiscountValidated && isFieldNotValidated === 0;
    return isALLFieldsValidated;
};

const handleNotificationSign = (target, showVerification = false, showWarning = false, $ = null) => {
    let labelBlock = null;
    if (target === $.form.querySelector('.add-item__input[name=discount]')) {
        labelBlock = target.parentNode.parentNode.querySelector('.add-item__subblock');
    } else {
        labelBlock = target.parentNode.querySelector('.add-item__subblock');
    }

    if (!labelBlock.querySelector('.add-item__warn-text')) {
        const warnText = createWarnText();
        labelBlock.insertAdjacentHTML('beforeend', warnText.outerHTML);
    }

    const warnText = labelBlock.querySelector('.add-item__warn-text');

    if (showVerification) {
        warnText.style.color = 'darkgreen';
        warnText.textContent = '  &#10003;';
        warnText.innerHTML = '  &#10003;';
    } else {
        warnText.innerHTML = '';
        warnText.textContent = '';
    }

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

export const handleCheckLength = (target, length, $) => {

    if (target.value.length === 0) {
        handleNotificationSign(target, false, false, $ = null);
        return false;
    }

    if (target.value.length >= length) {
        handleNotificationSign(target, true, false, $);
    } else {
        handleNotificationSign(target, false, true, $);
    }
    return target.value.length >= length;
};

export const handleDiscountValidation = ($) => {
    
    const target = $.form.querySelector('.add-item__input[name=discount]');

    target.value = target.value.replace(/[^0-9]/g, '');

    let numValue;

    if (target.value.length !== 0) {
        numValue = +target.value;
    } else {
        handleNotificationSign(target, false, false, $);
    }

    if (numValue === 0 || numValue > 99) {
        handleNotificationSign(target, false, true, $);
        return false;
    }
    if (numValue > 0 && numValue <= 99) {
        handleNotificationSign(target, true, false, $);
        return true;
    }
    return true;
};

export const countDescriptionLength = () => {
    const target = document.querySelector('.add-item__input[name=description]');
    const textCount = document.querySelector('.add-item__text-count');

    if (handleCheckLength(target, 80, $)) {
        textCount.textContent = '';
    } else {
        textCount.textContent = `${target.value.length.toString()}/80`;
    }
};

export const removeVisualValidation = ($) => {
    $.form.querySelectorAll('.add-item__warn-text').forEach(item => {
        item.remove();
    });
};

export const validateInput = ($) => {
    return new Promise((resolve, reject) => {
        if (handleAllValidations($)) {
            resolve(true);
        } else {
            reject('false');
        }
    });
};