import { getCheckAuth, postLogin, postRegister } from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const readCheckAuth = (activeFilter) => {
  return useQuery({
    queryKey: ["check-auth", activeFilter],
    queryFn: async () => await getCheckAuth(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const createRegister = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postRegister(payload),
    mutationKey: ["register"],
  });

  return { mutations };
};

export const createLogin = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postLogin(payload),
    mutationKey: ["login"],
  });

  return { mutations };
};
