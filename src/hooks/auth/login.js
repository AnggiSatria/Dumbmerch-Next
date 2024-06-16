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

export default function useAuth() {
  //   const user = useStoreUser((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [condition, setCondition] = useState("login");

  const { mutations: loginUser } = createLogin();
  const { mutations: registerUser } = createRegister();

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

      console.log(e);
      // user.handleGetUserLogged("pending", "");

      // const response = await mutationLogin.mutateAsync(e);
      // user.handleGetUserLogged("success", response?.data?.data?.slug);

      // if (response?.data?.data?.role === "admin") {
      //   setLoading(false);
      //   toast.error(`You don't have permission to access this application.`);
      // } else {
      //   Cookies.set("token", response?.data?.data?.token);
      //   setLoading(false);
      //   if (response?.data?.data?.access?.length === 0) {
      //     return (window.location.href = `/xplore-hq/${response?.data?.data?.slug}#create-pages`);
      //   } else if (response?.data?.data?.access?.length > 1) {
      //     return (window.location.href = `/xplore-hq/${response?.data?.data?.slug}/pick-company`);
      //   } else {
      //     return (window.location.href = `/xplore-hq/${
      //       response?.data?.data?.slug
      //     }/company/${response?.data?.data?.access?.map((res) => {
      //       return res?.url;
      //     })}/page/admin#general`);
      //   }
      // }

      if (condition === "login") {
        loginUser
          .mutateAsync(e)
          .then((res) => {
            const payload = res?.data?.data?.user;
            console.log(payload);
            console.log(res);
            setLoading(false);
            if (payload?.status === "customer") {
              Cookies.set("token", payload?.token);
              router.push(`/${payload?.id}/home`);
            } else {
              Cookies.set("token", payload?.token);
              router.push(`/${payload?.id}/product`);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              err && err?.response
                ? err && err?.response?.data?.data?.message
                : "Network Error, Please Check Again!"
            );
            setLoading(false);
          });
      } else {
        registerUser
          .mutateAsync(e)
          .then((res) => {
            console.log(res);
            const payload = res?.data?.data?.user;
            console.log(payload);
            // if (payload?.status === "customer") {
            //   Cookies.set("token", payload?.token);
            //   router.push(`/${payload?.id}/home`);
            // } else {
            //   Cookies.set("token", payload?.token);
            //   router.push(`/${payload?.id}/product`);
            // }
            toast.success(`Register Successfully`);
            setCondition(`login`);

            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              err && err?.response
                ? err && err?.response?.data?.data?.message
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
