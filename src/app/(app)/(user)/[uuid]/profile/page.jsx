"use client";

import Navbar from "@/components/manual/Navbar";
<<<<<<< HEAD
import { readCheckAuth, readTransaction } from "@/hooks";
=======
import { useReadCheckAuth, useReadProfiles, useReadTransaction } from "@/hooks";
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { FormatRupiah } from "@arismun/format-rupiah";

export default function Page() {
  const pathname = usePathname();
  const activeFilter = {
    keywords: "",
  };

<<<<<<< HEAD
  const { data: dataCheckAuth, isLoading } = readCheckAuth(activeFilter);
=======
  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);
  const { data: dataProfiles } = useReadProfiles(activeFilter)

  const profiles = dataProfiles && dataProfiles?.data?.data?.profile
>>>>>>> 76b2d72 (feat(developement-be): add profile update)

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;
  const activeFilters = {
    keywords: "",
  };

  const { data: dataTransaction, isLoading: loadingTransaction } =
    useReadTransaction(activeFilters);

  const transactionUsers =
<<<<<<< HEAD
    dataTransaction && dataTransaction?.data?.data?.transaction;

  console.log(transactionUsers);
=======
    dataTransaction && dataTransaction?.data?.transactions;
    
>>>>>>> 76b2d72 (feat(developement-be): add profile update)

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-5 gap-5">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />

      <div className="flex w-full max-w-[84%] xl:max-w-[1080px] mx-auto">
        <div className="flex w-full gap-5 min-h-[500px] xl:flex-row flex-col items-center">
          <div className="w-1/2 h-full flex gap-3">
            <div className="flex w-full h-full flex-col gap-3">
              <div className="flex w-full h-10 items-center text-[#F74D4D] font-bold text-3xl">
                My Profile
              </div>
              <div className="flex w-full flex-grow gap-5">
                <div className="flex w-6/12 h-full items-center">
                  <Image
                    className="!w-full !h-7/12 rounded-md shadow object-cover"
                    layout="responsive"
                    alt="detail-product.png"
                    src={`/uploads/${profiles?.image}` || "/assets/Frame.png"}
                    width={300}
                    height={400}
                  />
                </div>
                <div className="flex w-6/12 h-full  flex-col gap-3">
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Name:{" "}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {checkUsers?.name}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Email
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {checkUsers?.email}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Phone
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {profiles?.phone || "-"}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Gender
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {profiles?.gender || "-"}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Address
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {profiles?.address || "-"}
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-[#F74D4D] font-bold text-xl"
                  >
                    Status
                  </label>
                  <label
                    htmlFor=""
                    className="w-full text-white font-semibold text-base"
                  >
                    {checkUsers?.status}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full flex-col gap-5 flex">
            <div className="flex w-full h-full flex-col gap-3">
              <div className="flex w-full h-10 items-center text-[#F74D4D] font-bold text-3xl">
                My Transaction
              </div>
              <div className="flex w-full h-[460px] gap-3 overflow-y-auto flex-col">
                {transactionUsers?.map((res, idx) => {
                  return (
                    <div key={idx} className="flex w-full min-h-[150px] bg-[#303030] rounded-md">
                      <div className="flex w-[80%] h-full p-[18px] gap-3">
                        <div className="flex w-[30%] h-full rounded-md">
                          <Image
                            className="!h-full rounded-md shadow object-cover"
                            layout="responsive"
                            alt={res?.product?.image}
                            src={`/uploads/${res?.product?.image}` || "/Frame.png"}
                            width={80}
                            height={150}
                          />
                        </div>
                        <div className="flex w-[70%] h-full gap-3 flex-col">
                          <label
                            htmlFor=""
                            className="font-semibold text-base text-[#f74d4d]"
                          >
                            {res?.product?.name}
                          </label>
                          <label
                            htmlFor=""
                            className="font-semibold text-sm text-[#f74d4d]"
                          >
                            {res?.createdAt}
                          </label>
                          <label
                            htmlFor=""
                            className="font-semibold text-xs text-white"
                          >
                            Price: <FormatRupiah value={res?.price} />
                          </label>
                          <label
                            htmlFor=""
                            className="font-semibold text-xs text-white"
                          >
                            Sub Total: <FormatRupiah value={res?.price} />
                          </label>
                        </div>
                      </div>
                      <div
                        className={`flex w-[20%] h-full items-center text-white justify-center font-semibold ${(() => {
                          switch (res?.status) {
                            case "pending":
                              return "bg-[#8b8d265b]";
                            case "success":
                              return "bg-[#268d37b0]";
                            case "failed":
                              return "bg-[#8d26265b]";
                          }
                        })()}`}
                      >
                        {res?.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
