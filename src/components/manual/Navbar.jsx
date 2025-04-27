"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar({ checkUsers, pathname }) {
  const [isOpen, setIsOpen] = useState(false);

  const dataNavigation =
    checkUsers?.status === "customer"
      ? [
          { name: "Complain", value: "complain", href: `/${checkUsers?.id}/complain-user` },
          { name: "Profile", value: "profile", href: `/${checkUsers?.id}/profile` },
          { name: "Log Out", value: "logout", href: `/` },
        ]
      : [
          { name: "Complain", value: "complain", href: `/${checkUsers?.id}/complain-admin` },
          { name: "Category", value: "category", href: `/${checkUsers?.id}/category` },
          { name: "Product", value: "product", href: `/${checkUsers?.id}/product` },
          { name: "Log Out", value: "logout", href: `/` },
        ];

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <div className="relative z-50 w-[84%] xl:w-[1080px]">
      <nav className="w-full px-4 md:px-8 py-3 flex items-center justify-between mx-auto">
        <Link href={`/${checkUsers?.id}/home`}>
          <Image alt="logo" src="/Frame.png" width={50} height={50} />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {dataNavigation?.map((item, index) => (
            <Link key={index} href={item?.href}>
              <span
                onClick={() => {
                  if (item?.value === "logout") Cookies.remove("token");
                }}
                className={`cursor-pointer font-semibold hover:text-[#F74D4D] ${
                  pathname === item?.href ? "text-[#F74D4D]" : "text-white"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleNavbar}>
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-black px-6 py-4 flex flex-col items-end gap-2 shadow-lg rounded-b-lg z-40">
          {dataNavigation?.map((item, index) => (
            <Link key={index} href={item.href}>
              <span
                onClick={() => {
                  if (item?.value === "logout") Cookies.remove("token");
                  setIsOpen(false);
                }}
                className={`block font-medium text-base px-3 py-2 rounded-md ${
                  pathname === item?.href
                    ? "text-[#F74D4D] bg-gray-800"
                    : "text-white hover:text-[#F74D4D] hover:bg-gray-800"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
