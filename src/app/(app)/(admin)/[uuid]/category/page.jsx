"use client";

import Navbar from "@/components/manual/Navbar";
import Pagination from "@/components/manual/pagination";
import TableData from "@/components/manual/table";
import { readCategories, readCheckAuth } from "@/hooks";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function page() {
  const pathname = usePathname();
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = readCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Jumlah produk per halaman

  const activeFilterCategory = {
    keywords: "",
  };

  const { data: dataCategories, isLoading: loadingCategories } =
    readCategories(activeFilterCategory);

  console.log(dataCategories);

  const listCategories = dataCategories && dataCategories?.data?.data;

  console.log(listCategories);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const products = data.products;

  const handleEdit = (product) => {
    console.log(`Edit product with id: ${product.id}`);
    // Tambahkan logika edit di sini
  };

  const handleDelete = (product) => {
    console.log(`Delete product with id: ${product.id}`);
    // Tambahkan logika delete di sini
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
      value: "Image",
    },
    {
      value: "Name",
    },
    {
      value: "Price",
    },
    {
      value: "Actions",
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
          Our Products
        </h1>
        <TableData
          dataTd={listCategories?.categories}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          dataTh={dataTh}
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
