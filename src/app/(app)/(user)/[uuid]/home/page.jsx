"use client";

import { readCheckAuth, readProducts } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@uidotdev/usehooks";

export default function page() {
  const pathname = usePathname();
  console.log(pathname);

  const activeFilter = {
    keywords: "",
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const { data: dataCheckAuth, isLoading } = readCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const dataNavigation =
    checkUsers?.status === "customer"
      ? [
          {
            name: "Complain",
            value: "complain",
            href: `/${checkUsers?.id}/complain-user`,
          },
          {
            name: "Profile",
            value: "profile",
            href: `/${checkUsers?.id}/profile`,
          },
          {
            name: "Log Out",
            value: "logout",
            href: `/`,
          },
        ]
      : [
          {
            name: "Complain",
            value: "complain",
            href: `/${checkUsers?.id}/complaind-admin`,
          },
          {
            name: "Category",
            value: "category",
            href: `/${checkUsers?.id}/category`,
          },
          {
            name: "Product",
            value: "product",
            href: `/${checkUsers?.id}/product`,
          },
          {
            name: "Log Out",
            value: "logout",
            href: `/`,
          },
        ];

  const [keyword, setKeyword] = useState("");

  const debouncedKeywords = useDebounce(keyword, 500);

  const activeFilterProduct = {
    keyword: debouncedKeywords,
  };

  const { data: dataProducts, isLoading: loadingProducts } =
    readProducts(activeFilterProduct);

  const getProducts = dataProducts && dataProducts?.data?.data?.products;

  console.log(getProducts);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <main className="w-full min-h-screen border border-white items-center flex py-5 flex-col gap-5">
      <nav className="w-[84%] xl:w-[1080px] h-[60px] md:gap-5 flex md:justify-start justify-between">
        <Link href={`/${checkUsers?.id}/home`} className="flex w-[60px] h-full">
          <Image
            layout="responsive"
            alt="dumbmerch.png"
            src="/Frame.png"
            width={60}
            height={60}
          />
        </Link>

        <div className="flex md:hidden h-full w-[60px] items-end justify-center">
          <button
            onClick={toggleNavbar}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex flex-grow items-center justify-end">
          {dataNavigation?.map((res, idx) => {
            return (
              <div className="flex px-[18px] py-1.5  h-full items-center">
                <Link
                  key={idx}
                  href={res?.href}
                  className={`font-semibold   flex items-center hover:text-[#F74D4D] ${
                    pathname === res?.href ? `text-[#F74D4D]` : `text-white`
                  }`}
                >
                  {res?.name}
                </Link>
              </div>
            );
          })}
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute z-10 mt-16 w-screen sm:hidden left-0`}
        >
          <div className="shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden w-full">
            <div className="px-10 py-2 flex flex-col items-end">
              {dataNavigation.map((item, index) => (
                <Link key={index} href={item.href}>
                  <label
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href
                        ? "text-[#F74D4D] bg-gray-700"
                        : "text-white hover:text-[#F74D4D] hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </label>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

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

      {/* <div className="flex w-[84%] xl:w-[1080px] justify-center">
        <div className="inline-grid grid-flow-row md:grid-flow-col w-full min-h-[300px] gap-5 border border-white">
          {getProducts?.map((res) => {
            return (
              <div className="w-[250px] bg-white rounded-md h-[300px] shadow"></div>
            );
          })}
        </div>
      </div> */}

      <div className="w-full max-w-[84%] xl:max-w-[1080px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getProducts?.map((res, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow h-[500px] lg:h-[400px] flex flex-col"
            >
              <div className="flex w-full h-[400px] lg:h-[300px] px-3 py-3 rounded-t-md">
                <Image
                  className="rounded-t-md"
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
