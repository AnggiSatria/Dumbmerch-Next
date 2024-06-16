import api from "@/config/axios";
import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const getTransactions = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/transactions`, { params: { ...queryString } });
};

export const postTransaction = (payload) => {
  return api.post(`${handlers}/transaction`, payload);
};

export const postNotification = (payload) => {
  return api.post(`${handlers}/notification`, payload);
};
