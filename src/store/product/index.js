export const product = (set) => {
  return {
    products: {},
    productById: {},
    handleProducts: (value) =>
      set(() => ({
        products: value,
      })),
    handleProductById: (value) =>
      set(() => ({
        productById: value,
      })),
  };
};
