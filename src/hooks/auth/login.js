import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateLogin, useCreateRegister } from "../query";
import Cookies from "js-cookie";
// import { createLogin } from "@/service";
import { toast } from "react-hot-toast";
// import { useEffect } from "react";
// import Cookies from "js-cookie";
// import { useStoreUser } from "@/service/store/users";

export default function useAuth() {
  //   const user = useStoreUser((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState("login");

  const { mutations: loginUser } = useCreateLogin();
  const { mutations: registerUser } = useCreateRegister();

  const loginSchema = () => {
    switch (condition) {
      case "login":
        return Yup.object({
          email: Yup.string()
            .email("Email is invalid!")
            .required("Email is required"),
          password: Yup.string().required("Password is required"),
        });

      case "register":
        return Yup.object({
          name:
            condition === "login"
              ? Yup.string()
              : Yup.string().required("Name is required"),
          email: Yup.string()
            .email("Email is invalid!")
            .required("Email is required"),
          password: Yup.string().required("Password is required"),
        });
    }
  };

  const defaultValues =
    condition === "login"
      ? {
          email: "",
          password: "",
        }
      : {
          name: "",
          email: "",
          password: "",
        };

  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(loginSchema()),
  });

  const onSubmit = async (e) => {
    try {
      setLoading(true);
      if (condition === "login") {
        loginUser
          .mutateAsync(e)
<<<<<<< HEAD
          .then((res) => {
            const payload = res?.data?.data?.user;
            setLoading(false);
            if (payload?.status === "customer") {
              Cookies.set("token", payload?.token);
              return window.location.href = `/${checkUsers?.id}/home`
            } else {
              Cookies.set("token", payload?.token);
              return window.location.href = `/${checkUsers?.id}/product`
            }
          })
          .catch((err) => {
            toast.error(
              err && err?.response?.data?.error?.message
                ? err && err?.response?.data?.error?.message
                : "Network Error, Please Check Again!"
            );
            setLoading(false);
          });
      } else {
        registerUser
          .mutateAsync(e)
          .then(() => {
            toast.success(`Register Successfully`);
            setCondition(`login`);

            setLoading(false);
          })
          .catch((err) => {
            toast.error(
              err && err?.response?.data?.error?.message
                ? err && err?.response?.data?.error?.message
                : "Network Error, Please Check Again!"
            );
            setLoading(false);
          });
      }
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
    condition,
    setCondition,
    loading,
  };
}
