import {renderItems} from './render.js';
import {calculateTotal} from "./calculations.js";
export const loadGoogsHandler = ($) => {

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