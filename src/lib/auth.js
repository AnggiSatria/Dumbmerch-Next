import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // GANTI biar konsisten
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err) {
    throw new Error("Invalid Token");
  }
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies(); // <- HARUS di-await sekarang
  const tokenCookie = await cookieStore.get("token"); // ini juga di-await

  const token = tokenCookie?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // biasanya { id, email, name, ... }
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}
