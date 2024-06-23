import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createLogin,
  createProduct,
  createRegister,
  readCheckAuth,
} from "../query";
import Cookies from "js-cookie";
// import { createLogin } from "@/service";
import { toast } from "react-hot-toast";
import { z } from "zod";
// import { useEffect } from "react";
// import Cookies from "js-cookie";
// import { useStoreUser } from "@/service/store/users";

export default function useAddProduct() {
  //   const user = useStoreUser((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [idCategoryList, setIdCategoryList] = useState([]);

  const joinIdCategory = idCategoryList?.join(", ");
  console.log(joinIdCategory);

  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = readCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const MAX_FILE_SIZE = 1000000; // 1MB
  const ACCEPTED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/svg+xml",
    "image/webp",
  ];

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    desc: z.string().min(1, "Description is required"),
    price: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Price is required")
    ),
    image: z
      .any()
      .refine(
        (file) =>
          file instanceof File &&
          file.size <= MAX_FILE_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(file.type),
        {
          message: "Invalid file type or size",
        }
      ),
    qty: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "QTY is required")
    ),
  });

  //   Yup.object({
  //     name: Yup.string().required("Name is required"),
  //     desc: Yup.string().required("Describe is required"),
  //     price: Yup.number()
  //       .typeError("Only numbers are allowed")
  //       .required("Price is required")
  //       .integer("Only integer values are allowed"),
  //     image: Yup.mixed().required("Image is required"),
  //     qty: Yup.number().required("Quantity is required"),
  //     idUser: Yup.string().required("User Id is required"),
  //   });

  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
      price: "",
      image: "",
      qty: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { mutations } = createProduct();

  const onSubmit = async (e) => {
    try {
      setLoading(true);

      console.log(e);
      const formData = new FormData();
      formData.set("image", e.image, e.image.name);
      formData.set("name", e.name);
      formData.set("desc", e.desc);
      formData.set("qty", e.qty);
      formData.set("price", e.price);
      formData.set("idCategory", joinIdCategory);
      formData.set("idUser", checkUsers?.id);

      const response = await mutations.mutateAsync(formData);

      if (response?.status === 200) {
        router.push(`/${checkUsers?.id}/product`);
      }
      console.log(response);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      toast.error(
        error && error?.response
          ? error && error?.response?.data?.message
          : "Network Error, Please Check Again!"
      );
    }
  };

  return {
    form,
    onSubmit,
    loading,
    checkUsers,
    isLoading,
    idCategoryList,
    setIdCategoryList,
  };
}
