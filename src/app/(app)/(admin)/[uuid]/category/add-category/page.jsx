"use client";

import Navbar from "@/components/manual/Navbar";
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
import useAddCategory from "@/hooks/category/addCategory";
import { usePathname } from "next/navigation";
import React from "react";

export default function Page() {
  const pathname = usePathname();

  const { form, onSubmit, loading, checkUsers, isLoading } = useAddCategory();

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-5 gap-5 border border-white">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[84%] xl:max-w-[1080px] mx-auto gap-3 flex-col"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white rounded-md">Name: </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-[#F74D4D] text-white rounded-md">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
