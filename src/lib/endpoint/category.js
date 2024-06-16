import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const postCategory = (payload) => {
  return api.post(`${handlers}/product/`, payload);
};

export const getCategories = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/product`, { params: { ...queryString } });
};

export const getCategoryById = (activeFilter, id) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/product/${id}`, { params: { ...queryString } });
};

export const patchCategory = (payload, id) => {
  return api.put(`${handlers}/product/${id}`, payload);
};

export const deleteCategory = (payload, id) => {
  return api.delete(`${handlers}/product/${id}`, payload);
};
