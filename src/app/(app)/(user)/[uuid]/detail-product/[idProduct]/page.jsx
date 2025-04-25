"use client";

import Navbar from "@/components/manual/Navbar";
import { Button } from "@/components/ui/button";
import { useCreateTransaction, useReadCheckAuth, useReadProductById } from "@/hooks";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const pathname = usePathname();
  const idProducts = pathname?.split("/")?.[3];
  const params = useParams();
  const { mutations: mutateTransations } = useCreateTransaction();
  const router = useRouter();
  const id_product = params["idProduct"];

  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const activeFilterProductById = {
    keywords: "",
  };

  const { data: productById, isLoading: loadingProductById } = useReadProductById(
    activeFilterProductById,
    idProducts
  );

  const detailProductById = productById && productById?.data?.data;

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleBuy = async () => {
    try {
      const data = {
        idProduct: detailProductById?.id,
        idSeller: detailProductById.user?.id,
        price: detailProductById?.price,
      };
      mutateTransations
        .mutateAsync(data)
        .then((res) => {
          const token = res?.data?.payment?.token;

          window.snap.pay(token, {
            onSuccess: function (result) {
              /* You may add your own implementation here */
              router.push(`/${checkUsers?.id}/profile`);
            },
            onPending: function (result) {
              /* You may add your own implementation here */
              router.push(`/${checkUsers?.id}/profile`);
            },
            onError: function (result) {
              /* You may add your own implementation here */
            },
            onClose: function () {
              /* You may add your own implementation here */
              alert("you closed the popup without finishing the payment");
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center py-5 gap-5">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />

      <div className="flex w-full max-w-[84%] xl:max-w-[1080px] mx-auto">
        <div className="flex w-full gap-5 h-[500px] xl:flex-row flex-col items-center">
          <div className="w-1/2 h-full">
            <Image
              className="!h-full rounded-md shadow"
              layout="responsive"
              alt="detail-product.png"
              src={detailProductById?.image}
              width={300}
              height={300}
            />
          </div>
          <div className="w-full md:w-1/2 h-full flex-col gap-5 flex">
            <div className="flex w-full gap-3 flex-col">
              <label htmlFor="" className="font-bold text-white text-3xl">
                {detailProductById?.name}
              </label>
              <label htmlFor="" className="font-semibold text-white text-base">
                Stock: {detailProductById?.qty}
              </label>
              <label htmlFor="" className="font-semibold text-white text-base">
                {detailProductById?.desc}
              </label>
            </div>
            <Button
              onClick={() => handleBuy()}
              className="bg-[#F74D4D] w-full h-10 text-white font-semibold hover:bg-[#F74D4D] hover:opacity-80 rounded-md"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
