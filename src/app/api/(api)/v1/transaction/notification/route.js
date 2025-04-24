import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const statusResponse = await core.transaction.notification(body);
    const { order_id, transaction_status, fraud_status } = statusResponse;

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        await updateTransaction("pending", order_id);
      } else if (fraud_status === "accept") {
        await updateProduct(order_id);
        await updateTransaction("success", order_id);
      }
    } else if (transaction_status === "settlement") {
      await updateTransaction("success", order_id);
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      await updateTransaction("failed", order_id);
    } else if (transaction_status === "pending") {
      await updateTransaction("pending", order_id);
    }

    return Response.json({ status: "success" });
  } catch (error) {
    console.error("Error midtrans notification:", error);
    return Response.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}

async function updateTransaction(status, id) {
  await prisma.transaction.update({
    where: { id },
    data: { status },
  });
}

async function updateProduct(id) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (transaction) {
    await prisma.product.update({
      where: { id: transaction.idProduct },
      data: {
        qty: {
          decrement: 1,
        },
      },
    });
  }
}
