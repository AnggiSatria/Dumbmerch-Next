"use client";

import React, { useState } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { FormatRupiah } from "@arismun/format-rupiah";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useDeletedCategory, useDeletedProduct } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function TableData({
  id,
  dataTd,
  handleEdit,
  handleDelete,
  dataTh,
  isProduct = false,
  refetchCategories,
  refetchProducts,
  checkUsers,
}) {
  const router = useRouter();

  const { mutations: mutationsProducts } = useDeletedProduct();
  const { mutations: mutationsCategory } = useDeletedCategory();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {dataTh?.map((res, idx) => {
              return (
                <th key={idx} className="px-4 py-2 border-b-2 border-gray-200">
                  {res?.value}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {dataTd?.map((res, idx) => {
            return (
              <tr key={idx}>
                {isProduct ? (
                  <>
                    <td className="px-4 py-2 border-b border-gray-200 flex justify-center">
                      <Image
                        className="w-16 h-16 object-cover"
                        src={res?.image}
                        alt={res?.name}
                        width={64}
                        height={64}
                        layout="responsive"
                      />
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      {res?.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      <FormatRupiah value={res?.price} />
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      <div className="flex space-x-2 justify-center">
                        <Button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          onClick={() => {
                            handleEdit(res?.id);
                            router.push(
                              `/${checkUsers?.id}/product/${res?.id}`
                            );
                          }}
                        >
                          <PencilAltIcon className="h-5 w-5 mr-1" />
                          Edit
                        </Button>
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger
                            onClick={() => {
                              setOpen(true)
                              handleDelete(res?.id);
                            }}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" />
                            Delete
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure want to delete?
                              </DialogTitle>
                              <DialogDescription className="mt-5">
                                This action will permanently delete
                              </DialogDescription>
                              <DialogFooter>
                                <Button
                                  className="bg-[#F74D4D] text-white"
                                  onClick={() => {
                                    mutationsProducts
                                      .mutateAsync(id)
                                      .then((res) => {
                                        refetchProducts();
=======
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
                                      })
                                      .catch((err) => {
                                        console.error(err);
                                      });
                                  }}
                                >
                                  Yes
                                </Button>
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="text-white bg-[#0a0a0a]"
                                  >
                                    No
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      {res?.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 text-center">
                      <div className="flex space-x-2 justify-center">
                        <Button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          onClick={() => {
                            handleEdit(res?.id);
                            router.push(
                              `/${checkUsers?.id}/category/${res?.id}`
                            );
                          }}
                        >
                          <PencilAltIcon className="h-5 w-5 mr-1" />
                          Edit
                        </Button>

                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger
                            onClick={() => handleDelete(res?.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" />
                            Delete
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure want to delete?
                              </DialogTitle>
                              <DialogDescription className="mt-5">
                                This action will permanently delete
                              </DialogDescription>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    mutationsCategory
                                      .mutateAsync(id)
                                      .then((res) => {
                                        refetchCategories();
=======
                                        
>>>>>>> 76b2d72 (feat(developement-be): add profile update)
                                      })
                                      .catch((err) => {
                                        console.error(err);
                                      });
                                  }}
                                  className="bg-[#F74D4D] text-white"
                                >
                                  Yes
                                </Button>
                                <DialogClose asChild>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="text-white bg-[#0a0a0a]"
                                  >
                                    No
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
