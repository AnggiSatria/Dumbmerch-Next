import api from "@/config/axios";
import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const postProduct = (payload) => {
  return api.post(`${handlers}/product/`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/products`, { params: { ...queryString } });
};

export const getProductById = (activeFilter, id) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/product/${id}`, { params: { ...queryString } });
};

export const patchProduct = ({ payload, id }) => {
  return api.patch(`${handlers}/product/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (id) => {
  return api.delete(`${handlers}/product/${id}`);
};
