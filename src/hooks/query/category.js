import {
  deleteCategory,
  getCategories,
  getProductById,
  getProducts,
  patchCategory,
  postCategory,
} from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const createCategory = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postCategory(payload),
    mutationKey: ["create-category"],
  });

  return { mutations };
};

export const readCategories = (activeFilter) => {
  return useQuery({
    queryKey: ["categories", activeFilter],
    queryFn: async () => await getCategories(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const readCategoryById = (activeFilter) => {
  return useQuery({
    queryKey: ["category-by-id", activeFilter],
    queryFn: async () => await getProductById(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const updatedCategory = () => {
  const mutations = useMutation({
    mutationFn: async ({ payload, id }) => patchCategory({ payload, id }),
    mutationKey: ["patch-category-by-id"],
  });

  return { mutations };
};

export const deletedCategory = () => {
  const mutations = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    mutationKey: ["deleted-product"],
  });

  return { mutations };
};
