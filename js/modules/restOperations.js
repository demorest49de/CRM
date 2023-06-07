import {renderItems} from './render.js';
import {calculateFormTotal, calculateTotal} from './calculations.js';
import {handleAllValidations} from "./control.js";


const fetchRequest = async (url, {
  method = 'get',
  id = '',
  callback,
  headers,
  vars = {},
  body,
}) => {
  try {
    const options = {
      method,
    };

    if (id) url += id.toString();

    if (body) options.body = JSON.stringify(body);

    if (headers) options.headers = headers;

    const response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      if (callback) return callback(null, data, vars, id);
      return;
    }

    throw new Error(`Error ${response.status}: ${response.statusText}`);
  } catch (err) {
    console.log(' : ', err);
    return callback(err, null, vars);
  }
};

const httpRequest = (url, {
  method = 'get',
  id = '',
  callback,
  body = {},
  headers,
  vars = {},
}) => {
  try {
    const xhr = new XMLHttpRequest();

    if (id) {
      xhr.open(method, url + `/${id}`);
    } else {
      xhr.open(method, url);
    }

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        callback(new Error(xhr.status.toString()), xhr.response, vars);
        return;
      }

      const data = JSON.parse(xhr.response);
      if (callback) {
        callback(null, data, vars, id);
      }
    });

    xhr.addEventListener('error', () => {
      // console.info('  xhr.status, xhr.response: ', xhr.status, xhr.response);
      callback(new Error(xhr.status.toString()), xhr.response, vars);
    });

    xhr.send(JSON.stringify(body));
  } catch (err) {
    console.log(' : ', err);
    callback(new Error(err), null, vars);
  }
};

const handleErrorMessage = (error, data, $) => {
  $.app.append($.addItemError);
  setTimeout(() => {
    $.addItemError.classList.add('is-visible');
  }, 300);

  if (!data) data = error.message;
  console.warn(error, data);
};

const cbSendItem = (error, data, $) => {
  if (error) {
    handleErrorMessage(error, data, $);
    return;
  }

  loadGoodsHandler($);
};

const sbRenderItems = (error, data, $) => {
  if (error) {
    handleErrorMessage(error, data, $);
    return;
  }

  $.form.reset();
  $.overlay.classList.remove('is-visible');

  renderItems(data, $);
  calculateTotal($);
  // 4-15
  return `Успех!`;
};

const cbOpenEdit = (error, data, $, id) => {
  if (error) {
    handleErrorMessage(error, data, $);
    return;
  }

  $.form.querySelector('.add-item__block-id')
      .setAttribute('data-id', id);

  $.form.name.value = data.title;
  $.form.measure.value = data.units;
  $.form.category.value = data.category;

  if (+(data.discount) > 0) {
    $.form.discount.removeAttribute('disabled', '');
    $.form.discount.value = data.discount;
    $.form.querySelector('.add-item__checkbox').checked = 'true';
  } else {
    $.form.discount.setAttribute('disabled', '');
  }
  $.form.description.value = data.description;
  $.form.quantity.value = data.count;
  $.form.price.value = data.price;
  handleAllValidations($);
  calculateFormTotal($);
};

// get all
// export const loadGoodsHandler = ($) => {
//
//     httpRequest($.URL, {
//         method: $.verbs.get,
//         headers: {'Content-Type': 'application/json'},
//         callback: sbRenderItems,
//         vars: $,
//     });
// };

// get all
export const loadGoodsHandler = async ($) => {
  const result = await fetchRequest($.URL, {
    method: $.verbs.get,
    headers: {'Content-Type': 'application/json'},
    callback: sbRenderItems,
    vars: $,
  });

  return result;
};

// post
// export const sendGoodsHandler = (body, $) => {
//
//     httpRequest($.URL, {
//         method: $.verbs.post,
//         callback: cbSendItem,
//         headers: {'Content-Type': 'application/json'},
//         vars: $,
//         body: body,
//     });
// };

// post
export const sendGoodsHandler = (body, $) => {
  fetchRequest($.URL, {
    method: $.verbs.post,
    callback: cbSendItem,
    headers: {'Content-Type': 'application/json'},
    vars: $,
    body,
  });
};

// del by id
export const deleteGoodsHandler = ($, id) => {
  httpRequest($.URL, {
    method: $.verbs.delete,
    id,
    callback: cbSendItem,
    headers: {'Content-Type': 'application/json'},
    vars: $,
  });
};

// open edit
export const openEditHandler = ($, id) => {
  httpRequest($.URL, {
    method: $.verbs.get,
    id,
    callback: cbOpenEdit,
    headers: {'Content-Type': 'application/json'},
    vars: $,
  });
};

// patch by id
// export const updateItemHandler = (body, $, id) => {
//
//     httpRequest($.URL, {
//         method: $.verbs.patch,
//         id: id,
//         callback: cbSendItem,
//         headers: {'Content-Type': 'application/json'},
//         vars: $,
//         body: body,
//     });
// };

// patch by id
export const updateItemHandler = (body, $, id) => {
  fetchRequest($.URL, {
    method: $.verbs.patch,
    id,
    callback: cbSendItem,
    headers: {'Content-Type': 'application/json'},
    vars: $,
    body,
  });
};
