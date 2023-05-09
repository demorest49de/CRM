export const getConsts = () => {
    const URL = 'https://muddy-substantial-gear.glitch.me/api/goods';
    const verbs = {
        get: "get",
        post: "post", // повторное применение имеет тот же результат и не приведет к созданию нового объекта
        put: "put",// по id заменяеет весь объект и не создает новый
        delete: "delete",
        patch: "patch", // по id заменяеет часть объекта (меняет конкретные поля)
    };
    return {URL, verbs};
};