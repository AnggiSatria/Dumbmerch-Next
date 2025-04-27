import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(req) {
  try {
    const user = await getTokenFromCookie();
    const body = await req.json();

    const transactionId = uuidv4();

    const newTransaction = await prisma.transaction.create({
      data: {
        id: transactionId,
        idBuyer: user.id,
        idProduct: body.idProduct,
        idSeller: body.idSeller,
        price: body.price,
        status: "pending",
      },
    });

    const buyer = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    });
    
    const parameter = {
      transaction_details: {
        order_id: newTransaction.id,
        gross_amount: Number(newTransaction.price),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        full_name: buyer?.name,
        email: buyer?.email,
        phone: buyer?.profile?.phone || "021",
      },
    };

    const payment = await snap.createTransaction(parameter);

    return Response.json({
      status: "pending",
      message: "Pending transaction payment gateway",
      payment,
      product: { id: body.idProduct },
    });
  } catch (error) {
    console.error("Error addTransaction:", error);
    return Response.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}


