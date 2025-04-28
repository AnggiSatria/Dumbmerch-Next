import { io } from "socket.io-client";

let socket;

export function initSocket(token) {
  if (!socket) {
    let socketUrl = "";

    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost") {
        socketUrl = "http://localhost:3000"; // Saat development lokal
      } else {
        socketUrl = "https://dumbmerch-mu.vercel.app/"; // Ganti ke URL production backend kamu
      }
    }

    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  return socket;
}
