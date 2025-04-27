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

export const useDeletedProduct = (refetchProducts, setOpen) => {
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
