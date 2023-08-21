import {createRow} from './createElement.js';
import createElement from './createElement.js';

const {
  createSection,
  createHeader,
  createMainBlock,
  createOverlay,
} = createElement;

export const renderItems = (storage, $) => {
  while ($.tbody.firstChild) {
    $.tbody.removeChild($.tbody.firstChild);
  }

  Object.values(storage).forEach((value) => {
    const row = createRow(value);
    $.tbody.append(row);
  });
};

export const renderCRM = (app, title) => {
  const section = createSection();
  const sectionContainer = section.container;
  const header = createHeader(title);

  const {mainBlock, tbody, addItemBtn} = createMainBlock();

  sectionContainer.append(header);
  sectionContainer.append(mainBlock);

  const {overlay, form, formContent, addItemError, addItemBlock} = createOverlay();


  app.append(section);

  return {addItemBtn, overlay, tbody, form, header, formContent, addItemError, addItemBlock};
};
