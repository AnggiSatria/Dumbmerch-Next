import { removeEmptyAttributes } from "@/utils";
import QueryString from "qs";

const handlers = `/api/v1`;

export const getProfiles = (activeFilter) => {
  const queryString = QueryString.parse(removeEmptyAttributes(activeFilter));
  return api.get(`${handlers}/profile`, { params: { ...queryString } });
};
