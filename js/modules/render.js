export const renderItems = (tbody) => {
  const allRows = window.items.map(createRow);
  tbody.append(...allRows);
};

export const renderCRM = (app, title) => {
  const section = createSection();
  const sectionContainer = section.container;
  const header = createHeader(title);

  const {mainBlock, tbody, addItemBtn} = createMainBlock();
  renderItems(tbody);

  sectionContainer.append(header);
  sectionContainer.append(mainBlock);

  const {overlay, form} = createOverlay();

  app.append(section, overlay);

  return {addItemBtn, overlay, items: tbody, form, header};
};