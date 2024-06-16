export const generateBlobFile = async (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result || "");
      };
      reader.onerror = (error) => {
        reject(error);
      };
    }
  });
};
