import {renderCRM} from './modules/render.js';
import {handleControls} from './modules/control.js';
import {loadGoogsHandler} from './modules/loadGoods.js';


{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);

    const {addItemBtn, overlay, tbody, form, header} = crm;
    const generalVars = {addItemBtn, overlay, tbody, form, header, title};

    // Функционал

    handleControls(generalVars);
    loadGoogsHandler(generalVars);
  };

  window.listProductInit = init;
}