export const getConsts = () => {
    const URL = 'https://muddy-substantial-gear.glitch.me/api/goods';
    const verbs = {
        get: "get",
        post: "post",
        put: "put",
        delete: "delete",
        patch: "patch",
    };
    return {URL, verbs};
};