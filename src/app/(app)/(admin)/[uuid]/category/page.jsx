"use client";

import Navbar from "@/components/manual/Navbar";
import Pagination from "@/components/manual/pagination";
import TableData from "@/components/manual/table";
import { Button } from "@/components/ui/button";
import { useReadCategories, useReadCheckAuth } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = useReadCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Jumlah produk per halaman

  const activeFilterCategory = {
    keywords: "",
  };

  const {
    data: dataCategories,
    isLoading: loadingCategories,
    refetch: refetchCategories,
  } = useReadCategories(activeFilterCategory);

  const listCategories = dataCategories && dataCategories?.data?.data;

  const [id, setId] = useState("");

  const handleEdit = (idCategory) => {
    setId(idCategory);
  };

  const handleDelete = (idCategory) => {
    setId(idCategory);
  };

  // Menentukan produk yang akan ditampilkan di halaman saat ini
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = products.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );

  // Mengubah halaman saat tombol pagination diklik
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const dataTh = [
    {
      value: "Name",
    },

    {
      value: "Actions",
    },
    {
      value: (
        <>
          <Button
            onClick={() => {
              router.push(`/${checkUsers?.id}/category/add-category`);
            }}
            className="bg-[#F74D4D] text-white"
          >
            Add Category
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="inline-flex min-h-screen items-center bg-[#0a0a0a] w-full justify-center flex-col">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />
      <main className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Our Category
        </h1>
        <TableData
          dataTd={listCategories?.categories}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          dataTh={dataTh}
          id={id}
          refetchCategories={refetchCategories}
          checkUsers={checkUsers}
        />
        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={listCategories?.categories?.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
}
