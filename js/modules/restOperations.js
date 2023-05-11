import {renderItems} from './render.js';
import {calculateFormTotal, calculateTotal} from "./calculations.js";

const httpRequest = (url, {
    method = 'get',
    id = '',
    callback,
    body = {},
    headers,
    consts = {},
}) => {
    try {
        const xhr = new XMLHttpRequest();

        if (id) {
            xhr.open(method, url + `/${id}`);
        } else {
            xhr.open(method, url);
        }

        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }
        }

        xhr.addEventListener('load', () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                callback(new Error(xhr.status), xhr.response);
                return;
            }

            const data = JSON.parse(xhr.response);
            if (callback) {
                callback(null, data, consts, id);
            }
        });

        xhr.addEventListener('error', () => {
            console.info('  xhr.status, xhr.response: ', xhr.status, xhr.response);
            callback(new Error(xhr.status), xhr.response);
        });

        xhr.send(JSON.stringify(body));
    } catch (err) {
        console.log(' : ', err);
        callback(new Error(err));
    }
};

const loadGoods = (error, data, $) => {
    if (error) {
        console.warn(error, data);
        return;
    }

    loadGoodsHandler($);
};

const renderGoods = (error, data, $) => {
    if (error) {
        console.warn(error, data);
        return;
    }

    renderItems(data, $);
    calculateTotal($);
};

const editSingleItem = (error, data, $, id) => {
    if (error) {
        console.warn(error, data);
        return;
    }

    $.form.querySelector('.add-item__block-id')
        .setAttribute('data-id', id);

    $.form.name.value = data.title;
    $.form.measure.value = data.units;
    $.form.category.value = data.category;

    if (+(data.discount) > 0) {

        $.form.discount.removeAttribute('disabled', '');
        $.form.discount.value = data.discount;
        $.form.querySelector('.add-item__checkbox').checked = 'true';
    } else {
        $.form.discount.setAttribute('disabled', '');
    }
    $.form.description.value = data.description;
    $.form.quantity.value = data.count;
    $.form.price.value = data.price;
    calculateFormTotal($);
};


export const loadGoodsHandler = ($) => {

    httpRequest($.URL, {
        method: $.verbs.get,
        headers: {'Content-Type': 'application/json'},
        callback: renderGoods,
        consts: $,
    });
};

export const sendGoodsHandler = (body, $) => {

    httpRequest($.URL, {
        method: $.verbs.post,
        callback: loadGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
        body: body,
    });
};

export const deleteGoodsHandler = ($, id) => {

    httpRequest($.URL, {
        method: $.verbs.delete,
        id: id,
        callback: loadGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};

export const editGoodHandler = ($, id) => {

    httpRequest($.URL, {
        method: $.verbs.get,
        id: id,
        callback: editSingleItem,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};

export const updateGoodsHandler = (body, $, id) => {

    httpRequest($.URL, {
        method: $.verbs.patch,
        id: id,
        callback: loadGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
        body: body,
    });
};