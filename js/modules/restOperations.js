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
        const data = JSON.parse(xhr.response);
        // console.log(' : ', data);
        if (callback) {
            callback(data, consts);
        }
    });

    xhr.addEventListener('error', () => {
        console.log(' error: ',);
    });

    xhr.send(JSON.stringify(body));
};

const loadGoods = (data, $) => {
    loadGoodsHandler($);
};

const renderGoods = (data, $) => {
    console.log(' : ', data);
    renderItems(data, $);
    calculateTotal($);
};

const editSingleItem = (data, $) => {
    console.log(' : ',data);
    // $.form.querySelector('.add-item__block-id')
    //     .setAttribute('data-id', data[i].id);
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

export const deleteGoodsHandler = (id, $) => {

    httpRequest($.URL, {
        method: $.verbs.delete,
        id: id,
        callback: loadGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};

export const editGoodHandler = (id, $) => {

    httpRequest($.URL, {
        method: $.verbs.get,
        id: id,
        callback: editSingleItem,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};