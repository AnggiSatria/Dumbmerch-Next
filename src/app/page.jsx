"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/auth/login";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useReadCheckAuth } from "@/hooks";

export default function Home() {
  const token = Cookies.get(`token`);
  const router = useRouter();
  const { form, onSubmit, condition, setCondition, loading } = useAuth();

  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading, isError } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;  
  
  
  const dataFake = [
    {
      name: "Login",
      value: "login",
    },
    {
      name: "Register",
      value: "register",
    },
  ];

  const renderActive = (req) => {
    switch (req) {
      case "login":
        return setCondition(req);
      case "register":
        return setCondition(req);
      default:
        return setCondition(req);
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (!isLoading) {
        if (token === undefined || isError) {
          return router.push(`/`);
        } else {
          if (checkUsers?.status === "customer") {
            return window.location.href = `/${checkUsers?.id}/home` 
          } else {
            return window.location.href = `/${checkUsers?.id}/product`
          }
        }
    }
  }, [token, checkUsers]);

  return (
    <main className="inline-flex lg:flex-row min-h-screen items-center lg:items-start bg-[#0a0a0a] w-full justify-center lg:justify-start lg:p-10">
      <Toaster />
      <div className="hidden lg:flex w-7/12 h-[300px] lg:h-[500px] flex-col justify-between">
        <div className="flex w-full h-[300px] items-end">
          <div className="flex w-[250px] h-5/6">
            <Image
              layout="responsive"
              alt="dumbmerch.png"
              src="/Frame.png"
              width={250}
              height={250}
            />
          </div>
        </div>
        <div className="flex w-fit h-[70px] flex-col gap-3">
          <label htmlFor="" className="flex font-bold text-white text-4xl">
            Easy, Fast and Reliable
          </label>
          <label htmlFor="" className="font-semibold text-secondary text-sm">
            Go shopping for merchandise, just go to dumb merch shopping. the
            biggest merchandise in <span className="font-bold">Indonesia</span>
          </label>
        </div>
        <div className="flex w-[300px] h-[70px] gap-3 flex-row items-end">
          {dataFake?.map((res, idx) => {
            return (
              <Button
                key={idx}
                onClick={() => {
                  renderActive(res?.value);
                }}
                className={`w-[150px] h-10 text-white font-semibold hover:bg-[#F74D4D] hover:opacity-80 ${
                  condition === res?.value ? `bg-[#F74D4D]` : `bg-transparent`
                }`}
              >
                {res?.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex w-[300px] md:w-[500px] lg:w-5/12 h-[400px] lg:h-[500px] items-end justify-end ">
        <div className="flex rounded-md w-full lg:w-11/12 h-fit bg-[#181818] shadow p-[18px]">
          <div className="flex w-full h-full gap-4 flex-col">
            <div className="flex lg:hidden w-full h-[40px] gap-3 flex-row items-end">
              {dataFake?.map((res, idx) => {
                return (
                  <Button
                    key={idx}
                    onClick={() => {
                      renderActive(res?.value);
                    }}
                    className={` w-1/2 h-full text-white font-semibold hover:bg-[#F74D4D] hover:opacity-80 ${
                      condition === res?.value
                        ? `bg-[#F74D4D]`
                        : `bg-transparent`
                    }`}
                  >
                    {res?.name}
                  </Button>
                );
              })}
            </div>

            <label className="font-bold text-white text-4xl">
              {condition === "login" ? "Login" : "Register"}
            </label>
            <div className="flex flex-grow flex-col">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {condition === "login" ? (
                    ""
                  ) : (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-semibold text-base">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your name..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold text-base">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-white font-semibold text-base">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Input
                              type={passwordVisible ? "text" : "password"}
                              style={{ paddingRight: "2.5rem" }}
                              placeholder="Enter your password..."
                              {...field}
                            />
                            <div
                              style={{
                                position: "absolute",
                                right: "0.5rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={togglePasswordVisibility}
                            >
                              {passwordVisible ? (
                                <EyeOffIcon width={20} height={20} />
                              ) : (
                                <EyeIcon width={20} height={20} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={loading}
                    type="submit"
                    className="bg-[#F74D4D] w-full h-10 text-white font-semibold hover:bg-[#F74D4D] hover:opacity-80"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
