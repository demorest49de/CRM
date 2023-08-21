import {renderCRM} from './modules/render.js';
import {handleControls} from './modules/control.js';
import {loadGoodsHandler} from './modules/restOperations.js';
import {getConsts} from './modules/varsStorage.js';
import {handleSearch} from "./modules/input-search.js";


{
    const init = (selectorApp, title) => {
        const app = document.querySelector(selectorApp);
        const crm = renderCRM(app, title);
        const {URL, verbs, body, imageURL} = getConsts();
        const {addItemBtn, overlay, tbody, form, header, formContent, addItemError, addItemBlock} = crm;
        const generalVars = {
            addItemBtn,
            overlay,
            tbody,
            form,
            header,
            title,
            URL,
            verbs,
            formContent,
            body,
            app,
            addItemError,
            imageURL,
            addItemBlock,
        };

        // Функционал

        handleControls(generalVars);
        loadGoodsHandler(generalVars).then(data => {
        });
        handleSearch(generalVars);
    };

    window.listProductInit = init;
}
