import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = { ...body, status: body.status || "customer" };

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      status: Joi.string(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return NextResponse.json(
        { error: { message: error.details[0].message } },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json(
        { error: { message: "Account already existed" } },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // CREATE User + Profile secara bersamaan
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        status: data.status,
        profile: {
          create: {
            phone: null,
            gender: null,
            address: null,
            image: null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      status: newUser.status,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return NextResponse.json({
      status: "Success",
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
          token,
          profile: newUser.profile, // kalau mau kirim data profile juga
        },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
