export const getConsts = () => {
  const URL = 'https://muddy-substantial-gear.glitch.me/api/goods/';
  const imageURL = 'https://muddy-substantial-gear.glitch.me/';
  const verbs = {
    get: 'GET',
    post: 'POST', // повторное применение имеет тот же результат и не приведет к созданию нового объекта
    put: 'PUT', // по id заменяеет весь объект и не создает новый
    delete: 'DELETE',
    patch: 'PATCH', // по id заменяеет часть объекта (меняет конкретные поля)
  };

  const body = {
    title: '',
    description: '',
    category: '',
    price: NaN,
    discount: NaN,
    count: NaN,
    units: '',
    image: '',
  };

  return {URL, verbs, body, imageURL};
};
