import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const connectedUser = {};

export default function socketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    cors: { origin: "*" },
  });

  res.socket.server.io = io;

  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("client connected:", socket.id);

    const token = socket.handshake.auth.token;
    const tokenKey = process.env.SECRET_KEY;
    const { id: userId } = jwt.verify(token, tokenKey);

    connectedUser[userId] = socket.id;

    // Load admin contact
    socket.on("load admin contact", async () => {
      try {
        const admins = await prisma.user.findMany({
          where: { status: "admin" },
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                phone: true,
                gender: true,
                address: true,
                image: true,
              },
            },
          },
        });

        socket.emit("admin contact", admins);
      } catch (error) {
        console.error("Error loading admin contacts:", error.message);
        socket.emit("admin contact error", { message: error.message });
      }
    });

    // Load customer contact
    socket.on("load customer contact", async () => {
      try {
        const customers = await prisma.user.findMany({
          where: { status: "customer" },
          select: {
            id: true,
            email: true,
            name: true,
            profile: {
              select: {
                phone: true,
                gender: true,
                address: true,
                image: true,
              },
            },
            senderMessage: {
              select: { message: true, createdAt: true },
            },
            recipientMessage: {
              select: { message: true, createdAt: true },
            },
          },
        });

        socket.emit("customer contact", customers);
      } catch (error) {
        console.error("Error loading customer contacts:", error.message);
        socket.emit("customer contact error", { message: error.message });
      }
    });

    // Load messages
    socket.on("load messages", async (idRecipient) => {
      try {
        const idSender = userId;

        const messages = await prisma.chat.findMany({
          where: {
            OR: [
              { idSender, idRecipient },
              { idSender: idRecipient, idRecipient: idSender },
            ],
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            message: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            recipient: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        socket.emit("messages", messages);
      } catch (error) {
        console.error("Error loading messages:", error.message);
        socket.emit("messages error", { message: error.message });
      }
    });

    // Send message
    socket.on("send message", async ({ idRecipient, message }) => {
      try {
        const idSender = userId;

        await prisma.chat.create({
          data: {
            idSender,
            idRecipient,
            message,
          },
        });

        io.to(socket.id).to(connectedUser[idRecipient]).emit("new message");
      } catch (error) {
        console.error("Error sending message:", error.message);
        socket.emit("send message error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected:", socket.id);
      delete connectedUser[userId];
    });
  });

  res.end();
}
