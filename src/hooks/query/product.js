import {
  deleteProduct,
  getProductById,
  getProducts,
  patchProduct,
  postProduct,
} from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postProduct(payload),
    mutationKey: ["create-product"],
  });

  return { mutations };
};

export const useReadProducts = (activeFilter) => {
  return useQuery({
    queryKey: ["products", activeFilter],
    queryFn: async () => await getProducts(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useReadProductById = (activeFilter, id) => {
  return useQuery({
    queryKey: ["product-by-id", id, activeFilter],
    queryFn: async () => await getProductById(activeFilter, id),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const useUpdatedProduct = () => {
  const mutations = useMutation({
    mutationFn: async ({ payload, id }) => patchProduct({ payload, id }),
    mutationKey: ["put-product-by-id"],
  });

  return { mutations };
};

<<<<<<< HEAD
export const deletedProduct = () => {
=======
export const useDeletedProduct = (refetchProducts, setOpen) => {
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
  const mutations = useMutation({
    mutationFn: async (id) => deleteProduct(id),
    mutationKey: ["deleted-product"],
    onSuccess: () => {
      refetchProducts()
      setOpen(false)
    }
  });

  return { mutations };
};
