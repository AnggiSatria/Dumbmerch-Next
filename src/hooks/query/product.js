import {
  deleteProduct,
  getProductById,
  getProducts,
  patchProduct,
  postProduct,
} from "@/lib";
import { useMutation, useQuery } from "@tanstack/react-query";

export const createProduct = () => {
  const mutations = useMutation({
    mutationFn: async (payload) => postProduct(payload),
    mutationKey: ["create-product"],
  });

  return { mutations };
};

export const readProducts = (activeFilter) => {
  return useQuery({
    queryKey: ["products", activeFilter],
    queryFn: async () => await getProducts(activeFilter),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const readProductById = (activeFilter, id) => {
  return useQuery({
    queryKey: ["product-by-id", id, activeFilter],
    queryFn: async () => await getProductById(activeFilter, id),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

export const updatedProduct = () => {
  const mutations = useMutation({
    mutationFn: async ({ payload, id }) => patchProduct({ payload, id }),
    mutationKey: ["patch-product-by-id"],
  });

  return { mutations };
};

export const deletedProduct = () => {
  const mutations = useMutation({
    mutationFn: async (id) => deleteProduct(id),
    mutationKey: ["deleted-product"],
  });

  return { mutations };
};
