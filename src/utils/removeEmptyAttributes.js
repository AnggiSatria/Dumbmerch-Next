export const removeEmptyAttributes = (params) => {
  const queryString = Object?.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return queryString;
};
