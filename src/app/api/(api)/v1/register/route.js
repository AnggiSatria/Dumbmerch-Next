import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan file prisma.js ada
import Joi from "joi";
import bcrypt from "bcrypt";
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

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        status: data.status,
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
        },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
