import {renderItems} from './render.js';

export const getStorage = (title) => {
  return JSON.parse(localStorage.getItem(title)) || {data: [],};
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
