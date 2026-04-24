import prisma from "@/lib/prisma";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
  const sales = await prisma.sale.findMany({
    include: {
      user: { select: { username: true } },
      items: { include: { product: true } }
    },
    orderBy: { date: 'desc' }
  });

  return <HistoryClient initialSales={sales} />;
}
