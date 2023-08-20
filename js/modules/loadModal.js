const styles = new Map();

export const loadModalStyles = (url) => {
    
    if (styles.has(url)) return styles.get(url);
    
    const stylePromise = new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.addEventListener('load', () => {
            resolve(true);
        });
        document.head.append(link);
    });
    
    styles.set(url, stylePromise);
    console.log(' : ', stylePromise);
    return stylePromise;
};