const styles = new Map();

export const loadStylesAddItem = (url) => {
  if (styles.has(url)) return styles.get(url);
  // protestirovat' Map kollekciju;
  const stylePromise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', () => {
      resolve();
    });
    document.head.append(link);
  });

  styles.set(url, stylePromise);
  return stylePromise;
};
