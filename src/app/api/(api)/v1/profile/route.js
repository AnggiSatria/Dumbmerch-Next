// import { NextResponse } from "next/server";
// import { getTokenFromCookie } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const user = getTokenFromCookie();
//     if (!user) {
//       return NextResponse.json({
//         status: "failed",
//         message: "Unauthorized",
//       }, { status: 401 });
//     }

//     const profile = await prisma.profile.findUnique({
//       where: {
//         idUser: user.id,
//       },
//       select: {
//         id: true,
//         phone: true,
//         gender: true,
//         address: true,
//         image: true,
//       },
//     });

//     if (!profile) {
//       return NextResponse.json({
//         status: "failed",
//         message: "Profile not found",
//       }, { status: 404 });
//     }

//     const fullImagePath = profile.image
//       ? process.env.PATH_FILE + profile.image
//       : process.env.PATH_FILE + "Frame.png";

//     return NextResponse.json({
//       status: "success",
//       data: {
//         ...profile,
//         image: fullImagePath,
//       },
//     });
//   } catch (error) {
//     console.error("getProfile error:", error);
//     return NextResponse.json({
//       status: "failed",
//       message: "Server Error",
//     }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // ambil token setelah "Bearer"

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
    }

    const userId = decoded.id;

    const profile = await prisma.profile.findUnique({
      where: {
        idUser: userId,
      },
    });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: "Success",
      data: {
        profile,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
