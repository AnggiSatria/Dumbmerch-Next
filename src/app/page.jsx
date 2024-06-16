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
import { useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const { form, onSubmit, condition, setCondition, loading } = useAuth();

  return (
    <main className="inline-flex lg:flex-row min-h-screen items-center bg-[#0a0a0a] w-full justify-center lg:justify-start lg:p-10">
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
          <Button
            onClick={() => {
              setCondition("login");
            }}
            className="bg-[#F74D4D] w-[150px] h-10 text-white font-semibold hover:bg-[#F74D4D] hover:opacity-80"
          >
            Login
          </Button>
          <Button
            onClick={() => {
              setCondition("register");
            }}
            className="bg-transparent w-[150px] h-10 text-white font-semibold hover:bg-transparent hover:opacity-80"
          >
            Register
          </Button>
        </div>
      </div>
      <div className="flex w-[300px] md:w-[500px] lg:w-5/12 h-[400px] lg:h-[500px] items-end justify-end ">
        <div className="flex rounded-md w-full lg:w-11/12 h-full lg:h-fit bg-[#181818] shadow p-[18px]">
          <div className="flex w-full h-full gap-4 flex-col">
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
                      <FormItem>
                        <FormLabel className="text-white font-semibold text-base">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password..."
                            {...field}
                          />
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
