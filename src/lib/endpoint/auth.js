import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const getCheckAuth = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/check-auth`, { params: { ...queryString } });
};

export const postLogin = (payload) => {
  return api.post(`${handlers}/login/`, payload);
};

export const postRegister = (payload) => {
  return api.post(`${handlers}/register/`, payload);
};
