import {searchGoodsHandler} from "./restOperations.js";

export const handleSearch = ($) => {
    const searchInput = document.querySelector('.nav__input');

    const requestSearchedItems = () => {
        // console.log(' : ', searchInput.value);
        searchGoodsHandler($, searchInput.value)
    };

    const debounce = (fn, msec) => {
        let lastCall = 0;
        let lastCallTimerId = NaN;

        return (...args) => {
            const previousCall = lastCall;
            lastCall = Date.now();

            if (previousCall && ((lastCall - previousCall) < msec)) {
                // console.log(' timer id to delete: ', lastCallTimerId);
                clearTimeout(lastCallTimerId);
                // console.log(' : ', searchInput.value);
            }
            lastCallTimerId = setTimeout(() => fn(...args), msec);
            console.log(' new timer id: ', lastCallTimerId);

        };
    };

    const handleRequestSearch = debounce(requestSearchedItems, 400);

    searchInput.addEventListener('input', () => {
        handleRequestSearch();

        console.dir(handleRequestSearch);
    });
};