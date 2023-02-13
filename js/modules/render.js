import {createRow} from "./createElement.js";
import createElement from "./createElement.js";
const{
  createSection,
  createHeader,
  createMainBlock,
  createOverlay
} = createElement;

export const renderItems = (storage, $) => {
  while ($.tbody.firstChild) {
    $.tbody.removeChild($.tbody.firstChild);
  }

  Object.entries(storage.data).forEach(([index, value]) => {
    // const {id, title, price, description, category, discont, count, units, images} = value;
    const row = createRow(value);
    $.list.append(row);
  });
};

export const renderCRM = (app, title) => {
  const section = createSection();
  const sectionContainer = section.container;
  const header = createHeader(title);

  const {mainBlock, tbody, addItemBtn} = createMainBlock();

  sectionContainer.append(header);
  sectionContainer.append(mainBlock);

  const {overlay, form} = createOverlay();

  app.append(section, overlay);

  return {addItemBtn, overlay, items: tbody, form, header};
};