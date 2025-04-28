// app/api/chat/route.js
import { prisma } from "@/lib/prisma"; // pastikan prisma sudah di-setup di sini
import Pusher from "pusher";
import { NextResponse } from "next/server";

// Inisialisasi Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    // Parsing request body
    const { message, idSender, idRecipient } = await req.json();
    // Simpan pesan ke database
    const newMessage = await prisma.chat.create({
      data: {
        message,
        sender: {
          connect: { id: idSender }, // Menghubungkan sender dengan User yang sudah ada
        },
        recipient: {
          connect: { id: idRecipient }, // Menghubungkan recipient dengan User yang sudah ada
        },
      },
    });

    // Trigger event ke Pusher
    pusher.trigger(`chat_${idRecipient}`, "new_message", {
      message: newMessage.message,
      senderId: idSender,
      createdAt: newMessage.createdAt,
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error); // Menampilkan error lebih detail
    return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idSender = searchParams.get('idSender');
    const idRecipient = searchParams.get('idRecipient');

    if (!idSender || !idRecipient) {
      return NextResponse.json({ error: "Missing idSender or idRecipient" }, { status: 400 });
    }

    const messages = await prisma.chat.findMany({
      where: {
        idSender,
        idRecipient,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                image: true,
              },
            },
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
