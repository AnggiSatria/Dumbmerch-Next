import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = getTokenFromCookie();
    if (!user) {
      return NextResponse.json({
        status: "failed",
        message: "Unauthorized",
      }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        idUser: user.id,
      },
      select: {
        id: true,
        phone: true,
        gender: true,
        address: true,
        image: true,
      },
    });

    if (!profile) {
      return NextResponse.json({
        status: "failed",
        message: "Profile not found",
      }, { status: 404 });
    }

    const fullImagePath = profile.image
      ? process.env.PATH_FILE + profile.image
      : process.env.PATH_FILE + "Frame.png";

    return NextResponse.json({
      status: "success",
      data: {
        ...profile,
        image: fullImagePath,
      },
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return NextResponse.json({
      status: "failed",
      message: "Server Error",
    }, { status: 500 });
  }
}
