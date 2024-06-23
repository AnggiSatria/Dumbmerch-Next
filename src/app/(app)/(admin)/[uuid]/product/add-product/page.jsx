"use client";

import Navbar from "@/components/manual/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { readCategories, readCheckAuth } from "@/hooks";
import useAddProduct from "@/hooks/product/addProduct";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function page() {
  const pathname = usePathname();

  const {
    form,
    onSubmit,
    loading,
    checkUsers,
    isLoading,
    setIdCategoryList,
    idCategoryList,
  } = useAddProduct();

  //   console.log(form.watch());

  const activeFilterCategory = {
    keywords: "",
  };

  const {
    data: dataCategories,
    isLoading: loadingCategories,
    refetch: refetchCategories,
  } = readCategories(activeFilterCategory);

  const listCategories =
    dataCategories && dataCategories?.data?.data?.categories;

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-5 gap-5">
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
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white rounded-md">
                  Description:{" "}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white rounded-md">Price: </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch().image === "" ? (
            ""
          ) : (
            <img
              src={URL.createObjectURL(form.watch().image)}
              className="w-[150px] h-[150px] rounded-md"
            />
          )}

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder="Picture"
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white rounded-md">QTY: </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idCategory"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <>
                {listCategories?.map((res, idx) => {
                  console.log();

                  return (
                    <FormItem
                      key={idx}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow"
                    >
                      <FormControl>
                        <Checkbox
                          {...fieldProps}
                          className="bg-white"
                          checked={value}
                          onCheckedChange={(e) => {
                            console.log(e);
                            console.log(res?.id);
                            if (e) {
                              setIdCategoryList(
                                idCategoryList?.concat(res?.id)
                              );
                            } else {
                              setIdCategoryList(
                                idCategoryList?.filter(
                                  (filter) => res?.id !== filter
                                )
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">
                          {res?.name}
                        </FormLabel>
                      </div>
                    </FormItem>
                  );
                })}
              </>
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
