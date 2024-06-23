import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createLogin, createRegister } from "../query";
import Cookies from "js-cookie";
// import { createLogin } from "@/service";
import { toast } from "react-hot-toast";
// import { useEffect } from "react";
// import Cookies from "js-cookie";
// import { useStoreUser } from "@/service/store/users";

export default function useAddProduct() {
  //   const user = useStoreUser((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { mutations: loginUser } = createLogin();
  const { mutations: registerUser } = createRegister();

  const formSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    desc: Yup.string().required("Describe is required"),
    price: Yup.number()
      .typeError("Only numbers are allowed")
      .required("Price is required")
      .integer("Only integer values are allowed"),
    image: Yup.mixed().required("Image is required"),
    qty: Yup.number().required("Quantity is required"),
    idUser: Yup.string().required("User Id is required"),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      desc: "",
      price: "",
      image: "",
      qty: "",
      idUser: "",
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (e) => {
    try {
      setLoading(true);

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
  };
}
