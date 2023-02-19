import {renderCRM} from './modules/render.js';
import {calculateTotal} from './modules/calculations.js';
import control from './modules/control.js';
import serviceStorage from './modules/serviceStorage.js';

const {
  handleBlur, submitFormData, deleteRow, handleCloseForm,
  handleOpenForm, editRow, handleAddItemCheckbox,
} = control;

{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const crm = renderCRM(app, title);

    const {addItemBtn, overlay, tbody, form, header} = crm;
    const generalVars = {addItemBtn, overlay, tbody, form, header, title};

    // Функционал


    handleOpenForm(generalVars);
    handleCloseForm(generalVars);
    deleteRow(generalVars);
    editRow(generalVars);
    submitFormData(generalVars);
    handleBlur(generalVars);
    handleAddItemCheckbox(generalVars);

    serviceStorage.handleStorage(generalVars);
    calculateTotal(generalVars);
  };

  window.listProductInit = init;
}
