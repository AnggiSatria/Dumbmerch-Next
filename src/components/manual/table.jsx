"use client";

import React from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { FormatRupiah } from "@arismun/format-rupiah";

export default function TableData({
  dataTd,
  handleEdit,
  handleDelete,
  dataTh,
}) {
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
                <td className="px-4 py-2 border-b border-gray-200 flex justify-center">
                  <img
                    className="w-16 h-16 object-cover"
                    src={res?.image}
                    alt={res?.name}
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
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={() => handleEdit(res?.id)}
                    >
                      <PencilAltIcon className="h-5 w-5 mr-1" />
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={() => handleDelete(res?.id)}
                    >
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
