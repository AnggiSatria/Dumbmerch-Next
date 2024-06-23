"use client";

import React, { useState } from "react";
import Navbar from "@/components/manual/Navbar";
import TabelData from "@/components/manual/table";
import Pagination from "@/components/manual/pagination";
import { usePathname, useRouter } from "next/navigation";
import { readCheckAuth, readProducts } from "@/hooks";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Home = () => {
  const pathname = usePathname();
  const router = useRouter();
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading } = readCheckAuth(activeFilter);

  const checkUsers = dataCheckAuth && dataCheckAuth?.data?.data?.user;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Jumlah produk per halaman

  const activeFilterProduct = {
    keywords: "",
  };

  const {
    data: dataProducts,
    isLoading: loadingProducts,
    refetch: refetchProducts,
  } = readProducts(activeFilterProduct);

  const listProducts = dataProducts && dataProducts?.data?.data;

  // console.log(listProducts);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const products = data.products;

  const [id, setId] = useState("");

  const handleEdit = (product) => {
    console.log(`Edit product with id: ${product.id}`);
    // Tambahkan logika edit di sini
  };

  const handleDelete = (idProduct) => {
    setId(idProduct);
    console.log(`${idProduct}`);
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
    {
      value: (
        <>
          <Button
            onClick={() => {
              router.push(`/${checkUsers?.id}/product/add-product`);
            }}
            className="bg-[#F74D4D] text-white"
          >
            Add Product
          </Button>
        </>
      ),
    },
  ];

  return (
    <main className="inline-flex min-h-screen items-center bg-[#0a0a0a] w-full justify-center flex-col">
      <Navbar
        checkUsers={checkUsers}
        isLoading={isLoading}
        pathname={pathname}
      />
      <main className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Our Products
        </h1>
        <TabelData
          id={id}
          dataTd={listProducts?.products}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          dataTh={dataTh}
          isProduct={true}
          refetchProducts={refetchProducts}
          checkUsers={checkUsers}
        />
        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={listProducts?.products?.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </main>
    </main>
  );
};

export default Home;
