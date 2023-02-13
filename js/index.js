import {renderCRM} from './modules/render.js';
import {calculateTotal} from './modules/calculations.js';
import control from './modules/control.js';
import serviceStorage from './modules/serviceStorage.js';

const {
  handleBlur, handleForm, handleDeleteTableButton, handleCloseForm, handleOpenForm
} = control;

{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);

    const {addItemBtn, overlay, items, form, header} = crm;
    const generalVars = {addItemBtn, overlay, items, form, header, title};

    // Функционал

    calculateTotal(generalVars);

    handleOpenForm(generalVars);
    handleCloseForm(generalVars);
    handleDeleteTableButton(generalVars);
    handleForm(generalVars);
    handleBlur(generalVars);

    serviceStorage.handleStorage(generalVars);

  };

  window.listProductInit = init;
}