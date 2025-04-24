import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    return Response.json({
      status: "success",
      data: { categories },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "failed", message: "Server error" },
      { status: 500 }
    );
  }
}
