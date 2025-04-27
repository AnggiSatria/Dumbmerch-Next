import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) {
      return NextResponse.json(
        { error: { message: error.details[0].message } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: { message: "Email or Password is not Matching" } },
        { status: 400 }
      );
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);

    return NextResponse.json({
      status: "Success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          token,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
