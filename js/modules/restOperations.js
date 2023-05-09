import {renderItems} from './render.js';
import {calculateTotal} from "./calculations.js";

export const loadGoodsHandler = ($) => {

    const loadGoods = (callback) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'https://muddy-substantial-gear.glitch.me/api/goods');

        xhr.addEventListener('load', () => {
            const data = JSON.parse(xhr.response);
            callback(data);
        });

        xhr.addEventListener('error', () => {
            console.log(' errror: ',);
        });

        xhr.send();
    };

    const renderGoogs = (data) => {
        // console.log(' : ', data);

        renderItems(data, $);
        calculateTotal($);
    };

    loadGoods(renderGoogs);
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