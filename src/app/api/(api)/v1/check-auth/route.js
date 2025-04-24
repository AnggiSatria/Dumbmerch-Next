import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);

    return NextResponse.json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        message: error.message,
      },
      { status: 401 }
    );
  }
}
