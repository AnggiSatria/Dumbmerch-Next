import api from "@/config/axios";
import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const postCategory = (payload) => {
  return api.post(`${handlers}/category/`, payload);
};

export const getCategories = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/categories`, { params: { ...queryString } });
};

export const getCategoryById = (activeFilter, id) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/category/${id}`, { params: { ...queryString } });
};

export const patchCategory = ({ payload, id }) => {
  return api.patch(`${handlers}/category/${id}`, payload);
};

export const deleteCategory = (id) => {
  return api.delete(`${handlers}/category/${id}`);
};
