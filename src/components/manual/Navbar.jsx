"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar(props) {
  const { checkUsers, isLoading, pathname } = props;

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
            href: `/${checkUsers?.id}/complain-admin`,
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

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
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
              <div
                key={idx}
                className="flex px-[18px] py-1.5  h-full items-center"
              >
                <Link
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
              {dataNavigation?.map((item, index) => (
                <Link key={index} href={item.href}>
                  <label
                    onClick={() => {
                      if (res?.value === "logout") {
                        return Cookies.remove(`token`);
                      } else {
                        return "";
                      }
                    }}
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
    </>
  );
}
