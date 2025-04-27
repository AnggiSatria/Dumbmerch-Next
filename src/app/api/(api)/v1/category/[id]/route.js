// app/api/category/[id]/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
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
  const { id } = params;

  try {
    const body = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
      },
    });

    return Response.json({
      status: "success",
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error(error);

    // Error handling kalau id tidak ditemukan
    if (error.code === 'P2025') {
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

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.category.delete({
      where: { id },
    });

    return Response.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    // Error handling kalau id tidak ditemukan
    if (error.code === 'P2025') {
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
