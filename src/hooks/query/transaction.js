import { getTransactions, postNotification, postTransaction } from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useReadTransaction = (activeFilter) => {
  return useQuery({
    queryKey: ["transactions", activeFilter],
    queryFn: async () => await getTransactions(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useCreateTransaction = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postTransaction(payload),
    mutationKey: ["transaction"],
  });

  return { mutations };
};

export const useCreateNotification = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postNotification(payload),
    mutationKey: ["notification"],
  });

  return { mutations };
};
