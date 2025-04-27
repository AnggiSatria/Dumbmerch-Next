"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/manual/Navbar";
import TabelData from "@/components/manual/table";
import Pagination from "@/components/manual/pagination";
import { usePathname, useRouter } from "next/navigation";
import { useReadCheckAuth, useReadProducts } from "@/hooks";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

const Home = () => {
  const pathname = usePathname();
  const token = Cookies.get(`token`);
  const router = useRouter();
  const activeFilter = {
    keywords: "",
  };

  const { data: dataCheckAuth, isLoading, isError } = useReadCheckAuth(activeFilter);

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
  } = useReadProducts(activeFilterProduct);

  const listProducts = dataProducts && dataProducts?.data?.data;

<<<<<<< HEAD
  // console.log(listProducts);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const products = data.products;

=======
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
  const [id, setId] = useState("");

  const handleEdit = (product) => {
    // Tambahkan logika edit di sini
  };

  const handleDelete = (idProduct) => {
    setId(idProduct);
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

<<<<<<< HEAD
=======
  useEffect(() => {
      if (isLoading) return;
  
      if (token === undefined) {
        return window.location.href = `/`
      } else {
          if (checkUsers?.status === "customer") {
          return router.push(`/${checkUsers?.id}/home`) 
        } else {
          return router.push(`/${checkUsers?.id}/product`)
        }
      }
    }, [token, checkUsers]);

>>>>>>> 76b2d72 (feat(developement-be): add profile update)
  return (
    <main className="inline-flex min-h-screen items-center bg-[#0a0a0a] w-full flex-col">
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
