import {renderItems} from './render.js';
import {calculateTotal} from "./calculations.js";

const httpRequest = (url, {
    method = 'get',
    callback,
    body = {},
    headers,
    consts = {},
}) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    if (headers) {
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }
    }

    xhr.addEventListener('load', () => {
        const data = JSON.parse(xhr.response);
        console.log(' : ', data);
        if (callback) {
            callback(data, consts, method);
        }
    });

    xhr.addEventListener('error', () => {
        console.log(' error: ',);
    });

    xhr.send(JSON.stringify(body));
};

const renderGoods = (data, $, method) => {
    console.log(' : ', method);
    if (method != $.verbs.post) {
        renderItems(data, $);
        calculateTotal($);
    } else {
        loadGoodsHandler($);
    }
};

export const loadGoodsHandler = ($) => {

    httpRequest($.URL, {
        method: $.verbs.get,
        callback: renderGoods,
        consts: $,
    });
};

export const sendGoodsHandler = (body, $) => {

    httpRequest($.URL, {
        method: $.verbs.post,
        callback: renderGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
        body: body,
    });
};

export const deleteGoodsHandler = ($) => {

    httpRequest($.URL, {
        method: $.verbs.delete,
        callback: renderGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};