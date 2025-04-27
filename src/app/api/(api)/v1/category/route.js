import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const newCategory = await prisma.category.create({
      data: { name: body.name },
    });

    return Response.json({
      status: "success",
      data: { category: newCategory },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "failed", message: "Server error" },
      { status: 500 }
    );
  }
}
