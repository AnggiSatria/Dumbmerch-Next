import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useReadCheckAuth,
  useUpdatedCategory,
} from "../query";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function useEditCategory() {
  //   const user = useStoreUser((state) => state);
  const pathname = usePathname();
  const idCategory = pathname?.split("/")?.[3];
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const { mutations: editCategory } = useUpdatedCategory();

  const formSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (e) => {
    const id = idCategory;

    try {
      setLoading(true);

      editCategory
        .mutateAsync({
          payload: {
            id: idCategory,
            name: e.name,
          },
          id: idCategory,
        })
        .then((res) => {
          setLoading(false);
          router.push(`/${checkUsers?.id}/category`);
        })
        .catch((err) => {
          console.error(err);

          toast.error(
            err && err?.response
              ? err && err?.message
              : "Network Error, Please Check Again!"
          );
        });
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
  };
}
