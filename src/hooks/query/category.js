import {
  deleteCategory,
  getCategories,
  getCategoryById,
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

<<<<<<< HEAD
export const readCategoryById = (activeFilter) => {
=======
export const useReadCategoryById = (activeFilter, id) => {
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
  return useQuery({
    queryKey: ["category-by-id", id, activeFilter],
    queryFn: async () => await getCategoryById(activeFilter, id),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const updatedCategory = () => {
  const mutations = useMutation({
    mutationFn: async ({ payload, id }) => patchCategory({ payload, id }),
    mutationKey: ["put-category-by-id"],
  });

  return { mutations };
};

<<<<<<< HEAD
export const deletedCategory = () => {
  const mutations = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    mutationKey: ["deleted-product"],
=======
export const useDeletedCategory = (refetchProducts, setOpen) => {
  const mutations = useMutation({
    mutationFn: async (id) => deleteCategory(id),
    mutationKey: ["deleted-category"],
    onSuccess: () => {
      refetchProducts()
      setOpen(false)
    }
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
  });

  return { mutations };
};
