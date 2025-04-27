"use client";

import { useReadCheckAuth, useReadProducts } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@uidotdev/usehooks";
import Navbar from "@/components/manual/Navbar";
import Cookies from "js-cookie";

export default function Page() {
  const pathname = usePathname();
  const token = Cookies.get(`token`);
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading, isError } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const [keyword, setKeyword] = useState("");

  const debouncedKeywords = useDebounce(keyword, 500);

  const activeFilterProduct = {
    keyword: debouncedKeywords,
  };

  const { data: dataProducts, isLoading: loadingProducts } =
    useReadProducts(activeFilterProduct);

  const getProducts = dataProducts && dataProducts?.data?.data?.products;
  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

    useEffect(() => {
      if (!isLoading) {
          if (isError) {
            return window.location.href = `/`;
          } else {
            if (checkUsers?.status === "customer") {
              return window.location.href = `/${checkUsers?.id}/home` 
            } else {
              return window.location.href = `/${checkUsers?.id}/product`
            }
          }
      }
    }, [token, checkUsers, isError]);

  return (
    <main className="w-full min-h-screen border border-white items-center flex py-5 flex-col gap-5">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />

      <div className="flex w-[84%] xl:w-[1080px] mx-auto h-10 justify-between">
        <Input
          type="text"
          placeholder="Search..."
          className="w-1/2 md:w-4/12 h-full"
          onChange={handleChange}
        />
        <Select className="h-full">
          <SelectTrigger className="w-1/3 md:w-2/12 h-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full max-w-[84%] xl:max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getProducts?.map((res, index) => (
            <Link
              href={`/${checkUsers?.id}/detail-product/${res?.id}`}
              key={index}
              className="bg-white rounded-md shadow h-[500px] lg:h-[400px] flex flex-col"
            >
              <div className="flex w-full h-[400px] lg:h-[300px] px-3 py-3 rounded-t-md">
                <Image
                  className="rounded-t-md object-cover w-full h-full"
                  layout="responsive"
                  alt="dumbmerch.png"
                  src={res?.image}
                  width={300}
                  height={300}
                />
              </div>
              <div className="p-4 w-full h-[100px]">
                <h2 className="text-xl font-semibold">{res?.name}</h2>
                <p className="text-gray-600 truncate">{res?.desc}</p>
                <p className="text-gray-800 font-bold">Rp. {res?.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
