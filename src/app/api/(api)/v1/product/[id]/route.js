import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/upload"; // ini dari lib kamu

// GET: Detail produk
export async function GET(_, { params }) {
  try {
    const id = parseInt(params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ status: "failed", message: "Product not found" }, { status: 404 });
    }

    product.image = process.env.PATH_FILE + product.image;

    return NextResponse.json({ status: "success", data: product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}

// PUT: Update produk
// export async function PUT(req, { params }) {
//   try {
//     const id = parseInt(params.id);
//     const formData = await req.formData();

//     const categoryId = formData.get("categoryId")?.split(",").map(Number).filter(Boolean) || [];
//     const userId = 1; // Ganti dengan ambil user dari cookie / session kalau perlu
//     const updateData = {
//       name: formData.get("name"),
//       desc: formData.get("desc"),
//       price: parseInt(formData.get("price")),
//       qty: parseInt(formData.get("qty")),
//       idUser: userId,
//     };

//     const newImage = formData.get("image");
//     if (newImage?.name) {
//       updateData.image = newImage.name;
//     }

//     // Update produk
//     await prisma.product.update({
//       where: { id },
//       data: updateData,
//     });

//     // Hapus relasi kategori lama
//     await prisma.categoryProduct.deleteMany({
//       where: { idProduct: id },
//     });

//     // Tambahkan relasi kategori baru
//     if (categoryId.length > 0) {
//       await prisma.categoryProduct.createMany({
//         data: categoryId.map((catId) => ({
//           idProduct: id,
//           idCategory: catId,
//         })),
//       });
//     }

//     return NextResponse.json({
//       status: "success",
//       data: {
//         id,
//         ...updateData,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
//   }
// }

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req, { params }) {
  try {
    const id = parseInt(params.id);
    const { fields, files } = await parseForm(req);

    const updateData = {
      name: fields.name,
      desc: fields.desc,
      price: parseInt(fields.price),
      qty: parseInt(fields.qty),
      idUser: 1, // ganti sesuai cookie
    };

    if (files.image) {
      updateData.image = files.image[0].newFilename;
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    await prisma.categoryProduct.deleteMany({ where: { idProduct: id } });

    const categoryId = fields.categoryId?.split(",").map(Number).filter(Boolean) || [];
    if (categoryId.length > 0) {
      await prisma.categoryProduct.createMany({
        data: categoryId.map((catId) => ({
          idProduct: id,
          idCategory: catId,
        })),
      });
    }

    return NextResponse.json({
      status: "success",
      data: { id, ...updateData },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}

// DELETE: Hapus produk
export async function DELETE(_, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.categoryProduct.deleteMany({
      where: { idProduct: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ status: "success", data: { id } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
