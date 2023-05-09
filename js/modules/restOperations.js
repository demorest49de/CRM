import {renderItems} from './render.js';
import {calculateTotal} from "./calculations.js";

const httpRequest = (url, {
    method = 'get',
    callback,
    body = {},
}) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.addEventListener('load', () => {
        const data = JSON.parse(xhr.response);
        callback(data);
    });

    xhr.addEventListener('error', () => {
        console.log(' error: ',);
    });

    xhr.send(JSON.stringify(body));
};

export const loadGoodsHandler = ($) => {
    const renderGoods = (data) => {
        renderItems(data, $);
        calculateTotal($);
    };

    httpRequest($.URL, {
        method: 'get',
        callback: renderGoods,
    });
};

export const sendGoodsHandler = (body, $) => {

    const sendGoods = (callback) => {
        const xhr = new XMLHttpRequest();
        xhr.open('post', 'https://muddy-substantial-gear.glitch.me/api/goods');

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('load', () => {
            JSON.parse(xhr.response);
            callback();
        });

        xhr.addEventListener('error', () => {
            console.log(' error: ',);
        });

        xhr.send(JSON.stringify(body));
    };

    const renderGoogs = () => {
        loadGoodsHandler($);
    };

    sendGoods(renderGoogs);
};