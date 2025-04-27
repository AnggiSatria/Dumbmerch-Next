import { getTokenFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const user = await getTokenFromCookie();

//     const transactions = await prisma.transaction.findMany({
//       where: { idBuyer: user.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         product: true,
//         buyer: true,
//         seller: true,
//       },
//     });

//     const data = transactions.map((tx) => ({
//       ...tx,
//       product: {
//         ...tx.product,
//         image: process.env.PATH_FILE + tx.product.image,
//       },
//     }));

//     return Response.json({ status: "success", data: { transaction: data } });
//   } catch (error) {
//     console.error("Error getTransactions:", error);
//     return Response.json({ status: "failed", message: "Server Error" }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        product: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    // Ubah BigInt jadi String
    const serializedTransactions = transactions.map((transaction) => ({
      ...transaction,
      price: transaction.price?.toString() || null,
      product: transaction.product
        ? {
            ...transaction.product,
            price: transaction.product.price.toString(),
          }
        : null,
    }));

    return Response.json({
      status: "success",
      transactions: serializedTransactions,
    });
  } catch (error) {
    console.error("Error getTransactions:", error);
    return Response.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
