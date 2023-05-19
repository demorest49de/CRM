import {renderCRM} from './modules/render.js';
import {handleControls} from './modules/control.js';
import {loadGoodsHandler} from './modules/restOperations.js';
import {getConsts} from './modules/varsStorage.js';


{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);
    const {URL, verbs, body} = getConsts();
    const {addItemBtn, overlay, tbody, form, header, formContent, addItemError} = crm;
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
    };

    // Функционал

    handleControls(generalVars);
    loadGoodsHandler(generalVars);
  };

  window.listProductInit = init;
}
