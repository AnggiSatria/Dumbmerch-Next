import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useCreateCategory,
  useReadCheckAuth,
} from "../query";
import { toast } from "react-hot-toast";

export default function useAddCategory() {
  //   const user = useStoreUser((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const { mutations: addCategory } = useCreateCategory();

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
    try {
      setLoading(true);

      addCategory
        .mutateAsync(e)
        .then((res) => {
          setLoading(false);
          router.push(`/${checkUsers?.id}/category`);
        })
        .catch((err) => {
          console.error(err);

          toast.error(
            err && err?.response
              ? err && err?.response?.data?.data?.message
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
