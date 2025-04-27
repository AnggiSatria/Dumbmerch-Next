// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getTokenFromCookie } from "@/lib/auth"; // fungsi custom ambil user

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const image = formData.get("image"); // nama file
//     const idCategory = formData.get("idCategory").split(",");
//     const token = getTokenFromCookie(req); // ambil idUser dari cookie
//     const userId = token.id;

//     const newProduct = await prisma.product.create({
//       data: {
//         name: formData.get("name"),
//         desc: formData.get("desc"),
//         price: parseInt(formData.get("price")),
//         image: image.name, // pastikan image sudah diupload
//         qty: parseInt(formData.get("qty")),
//         idUser: userId,
//         categories: {
//           create: idCategory.map((idCat) => ({
//             category: { connect: { id: parseInt(idCat) } },
//           })),
//         },
//       },
//       include: {
//         user: { select: { id: true, name: true, email: true } },
//         categories: {
//           include: {
//             category: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       status: "success",
//       data: {
//         ...newProduct,
//         image: process.env.PATH_FILE + newProduct.image,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/auth";
import { parseForm } from "@/lib/upload"; // ini dari lib kamu


export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);
    const token = getTokenFromCookie(req);
    const userId = token.id;

    const categories = fields.idCategory?.split(",").map((id) => parseInt(id)) || [];

    const fileName = files.image[0].newFilename;

    const product = await prisma.product.create({
      data: {
        name: fields.name,
        desc: fields.desc,
        price: parseInt(fields.price),
        qty: parseInt(fields.qty),
        image: fileName,
        idUser: userId,
        categories: {
          create: categories.map((catId) => ({
            category: { connect: { id: catId } },
          })),
        },
      },
      include: {
        user: true,
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({
      status: "success",
      data: {
        ...product,
        image: `${process.env.PATH_FILE}${product.image}`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
