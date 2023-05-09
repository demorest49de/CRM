import {renderCRM} from './modules/render.js';
import {handleControls} from './modules/control.js';
import {loadGoodsHandler} from './modules/restOperations.js';
import {getConsts} from "./modules/constsStorage.js";


{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);
    const {URL, verbs} = getConsts();
    const {addItemBtn, overlay, tbody, form, header} = crm;
    const generalVars = {addItemBtn, overlay, tbody, form, header, title, URL, verbs};

    // Функционал

    handleControls(generalVars);
    loadGoodsHandler(generalVars);
  };

  window.listProductInit = init;
}