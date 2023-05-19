export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", (err) => {
      reject(err);
    });

    reader.readAsDataURL(file);
  });
