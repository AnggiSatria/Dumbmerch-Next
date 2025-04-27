import { getTokenFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper buat ubah semua BigInt di object jadi String
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

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const price = parseInt(formData.get("price"));
    const qty = parseInt(formData.get("qty"));
    const idCategory = formData.get("idCategory"); // format: "id1,id2,id3"
    const imageFile = formData.get("image");

    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json({ status: "failed", message: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;
    if (!userId) {
      return NextResponse.json({ status: "failed", message: "Invalid token" }, { status: 401 });
    }

    let image = "";
    if (imageFile) {
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
      image = safeName;
    }

    const categoriesArray = idCategory
      ? idCategory.split(",").map((catId) => ({
          idCategory: catId,
        }))
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        desc,
        price: BigInt(price),
        qty,
        image,
        idUser: userId,
        CategoryProduct: {
          create: categoriesArray,
        },
      },
      include: {
        user: true,
        CategoryProduct: {
          include: {
            category: true,
          },
        },
      },
    });

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
