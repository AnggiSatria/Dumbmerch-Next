export async function GET() {
  try {
    const user = await getTokenFromCookie();

    const transactions = await prisma.transaction.findMany({
      where: { idBuyer: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });

    const data = transactions.map((tx) => ({
      ...tx,
      product: {
        ...tx.product,
        image: process.env.PATH_FILE + tx.product.image,
      },
    }));

    return Response.json({ status: "success", data: { transaction: data } });
  } catch (error) {
    console.error("Error getTransactions:", error);
    return Response.json({ status: "failed", message: "Server Error" }, { status: 500 });
  }
}
