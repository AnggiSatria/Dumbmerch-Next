import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");
    const sort_by = searchParams.get("sort_by") || "name";
    const order = searchParams.get("order")?.toUpperCase() || "ASC";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { desc: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort_by]: order },
        include: {
          user: { select: { id: true, name: true, email: true } },
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithImage = products.map((p) => ({
      ...p,
      image: process.env.PATH_FILE + p.image,
    }));

    return NextResponse.json({
      status: "success",
      data: {
        products: productsWithImage,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
