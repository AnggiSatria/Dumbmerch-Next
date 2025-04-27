import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
      select: { id: true, name: true },
    });

    if (!category) {
      return Response.json(
        { status: "failed", message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "failed", message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { name: body.name },
    });

    return Response.json({
      status: "success",
      data: { category: updated },
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return Response.json(
        { status: "failed", message: "Category not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { status: "failed", message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return Response.json({
      status: "success",
      data: { id: parseInt(params.id) },
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return Response.json(
        { status: "failed", message: "Category not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { status: "failed", message: "Server error" },
      { status: 500 }
    );
  }
}
