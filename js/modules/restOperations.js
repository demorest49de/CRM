import {renderItems} from './render.js';
import {calculateTotal} from "./calculations.js";

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
            callback(data, consts, method);
        }
    });

    xhr.addEventListener('error', () => {
        console.log(' error: ',);
    });

    xhr.send(JSON.stringify(body));
};

const loadGoods = (data, $, method) => {
    loadGoodsHandler($);
};

const renderGoods = (data, $, method) => {
    console.log(' : ', data);
    renderItems(data, $);
    calculateTotal($);
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