import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper untuk serialize BigInt
function serialize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === 'object') {
    const serializedObj = {};
    for (const key in obj) {
      serializedObj[key] = serialize(obj[key]);
    }
    return serializedObj;
  }
  return obj;
}

// GET by id
export async function GET(req, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
        CategoryProduct: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ status: "failed", message: "Product not found" }, { status: 404 });
    }

    const serializedProduct = serialize(product);

    return NextResponse.json({
      status: "success",
      data: {
        ...serializedProduct,
        image: `${process.env.PATH_FILE}${serializedProduct.image}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}

// PUT (Update)
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const price = parseInt(formData.get("price"));
    const qty = parseInt(formData.get("qty"));
    const idCategory = formData.get("idCategory"); // format: "id1,id2,id3"
    const imageFile = formData.get("image");

    let updatedData = {
      name,
      desc,
      price: BigInt(price),
      qty,
    };

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const ext = path.extname(imageFile.name);
      const safeName = `${timestamp}-${imageFile.name}`.replace(/\s+/g, "-");
      const filePath = path.join(uploadsDir, safeName);

      fs.writeFileSync(filePath, buffer);
      updatedData.image = safeName;
    }

    // Update Product
    const product = await prisma.product.update({
      where: { id },
      data: updatedData,
    });

    // Update CategoryProduct
    if (idCategory) {
      const categoriesArray = idCategory.split(",").map((catId) => ({
        idCategory: catId,
        idProduct: id,
      }));

      // Hapus semua relasi lama
      await prisma.categoryProduct.deleteMany({
        where: { idProduct: id },
      });

      // Tambahkan relasi baru
      await prisma.categoryProduct.createMany({
        data: categoriesArray,
      });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
        CategoryProduct: {
          include: {
            category: true,
          },
        },
      },
    });

    const serializedProduct = serialize(updatedProduct);

    return NextResponse.json({
      status: "success",
      data: {
        ...serializedProduct,
        image: `${process.env.PATH_FILE}${serializedProduct.image}`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ status: "failed", message: "Product not found" }, { status: 404 });
    }

    // Hapus relasi CategoryProduct dulu (kalau tidak, error foreign key constraint)
    await prisma.categoryProduct.deleteMany({
      where: { idProduct: id },
    });

    // Hapus produk
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
