import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const postProduct = (payload) => {
  return api.post(`${handlers}/product/`, payload);
};

export const getProducts = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/product`, { params: { ...queryString } });
};

export const getProductById = (activeFilter, id) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/product/${id}`, { params: { ...queryString } });
};

export const patchProduct = (payload, id) => {
  return api.put(`${handlers}/product/${id}`, payload);
};

export const deleteProduct = (payload, id) => {
  return api.delete(`${handlers}/product/${id}`, payload);
};
