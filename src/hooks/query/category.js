import {
  deleteCategory,
  getCategories,
  getCategoryById,
  patchCategory,
  postCategory,
} from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateCategory = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postCategory(payload),
    mutationKey: ["create-category"],
  });

  return { mutations };
};

export const useReadCategories = (activeFilter) => {
  return useQuery({
    queryKey: ["categories", activeFilter],
    queryFn: async () => await getCategories(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useReadCategoryById = (activeFilter) => {
  return useQuery({
    queryKey: ["category-by-id", id, activeFilter],
    queryFn: async () => await getCategoryById(activeFilter, id),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useUpdatedCategory = () => {
  const mutations = useMutation({
    mutationFn: async ({ payload, id }) => patchCategory({ payload, id }),
    mutationKey: ["put-category-by-id"],
  });

  return { mutations };
};

export const useDeletedCategory = () => {
  const mutations = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    mutationKey: ["deleted-category"],
  });

  return { mutations };
};
