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
    xhr.open(method, url + `/${id}`);

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

    if(method = $.verbs.get){
        loadGoodsHandler($);
        return;
    }

    if (data && method !== $.verbs.post) {
        renderItems(data, $);
        calculateTotal($);
    } else {
        loadGoodsHandler($);
    }
};

const getGoods = (data, $, method) => {
    renderItems(data, $);
    calculateTotal($);
};

export const loadGoodsHandler = ($) => {

    httpRequest($.URL, {
        method: $.verbs.get,
        headers: {'Content-Type': 'application/json'},
        callback: getGoods,
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

export const deleteGoodsHandler = (id, $) => {

    httpRequest($.URL, {
        method: $.verbs.delete,
        id: id,
        callback: renderGoods,
        headers: {'Content-Type': 'application/json'},
        consts: $,
    });
};