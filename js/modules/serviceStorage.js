import {renderItems} from './render.js';

const createEmptyObject = () => JSON.stringify({
  data: [],
});

export const getStorage = (title) => {
  const empty = createEmptyObject();
  let storage = localStorage.getItem(title) ?
    localStorage.getItem(title) : localStorage.setItem(title, empty);
  if (!storage) storage = localStorage.getItem(title);
  return JSON.parse(storage);
};

export const saveStorage = (storage, nameApp) => {
  localStorage.setItem(nameApp, JSON.stringify(storage));
};

const handleStorage = ($) => {
  const storage = getStorage($.title);
  if (storage.data.length === 0) return;
  renderItems(storage, $);
};

export default {
  handleStorage,
};
