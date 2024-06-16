export const category = (set) => {
  return {
    categories: {},
    categoryById: {},
    handleCategories: (value) =>
      set(() => ({
        categories: value,
      })),
    handleCategoryById: (value) =>
      set(() => ({
        categoryById: value,
      })),
  };
};
