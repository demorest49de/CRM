import {renderCRM} from './modules/render.js';
import {handleControls} from './modules/control.js';
import {loadGoodsHandler} from './modules/restOperations.js';
import {getConsts} from "./modules/constsStorage.js";


{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);
    const {URL} = getConsts();
    const {addItemBtn, overlay, tbody, form, header} = crm;
    const generalVars = {addItemBtn, overlay, tbody, form, header, title, URL};

    // Функционал

    handleControls(generalVars);
    loadGoodsHandler(generalVars);
  };

  window.listProductInit = init;
}