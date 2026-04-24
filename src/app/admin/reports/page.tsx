import prisma from "@/lib/prisma";
import ReportsClient from "./ReportsClient";

export default async function FinancialReports() {
  const [sales, purchases] = await Promise.all([
    prisma.sale.findMany({
      include: {
        items: { include: { product: true } }
      },
      orderBy: { date: 'asc' }
    }),
    prisma.purchase.findMany({
      include: {
        items: { include: { product: true } }
      },
      orderBy: { date: 'asc' }
    })
  ]);

  // Transform data for the client component
  // Group by date to create a timeline of revenue and expenses
  const dailyData: Record<string, { date: string, revenue: number, expense: number, txCount: number }> = {};

  sales.forEach(s => {
    const d = s.date.toISOString().split('T')[0];
    if (!dailyData[d]) dailyData[d] = { date: d, revenue: 0, expense: 0, txCount: 0 };
    dailyData[d].revenue += s.totalAmount;
    dailyData[d].txCount += 1;
  });

  purchases.forEach(p => {
    const d = p.date.toISOString().split('T')[0];
    if (!dailyData[d]) dailyData[d] = { date: d, revenue: 0, expense: 0, txCount: 0 };
    dailyData[d].expense += p.totalAmount;
  });

  const chartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);
  const totalTx = chartData.reduce((acc, curr) => acc + curr.txCount, 0);
  const profit = totalRevenue - totalExpense;

  return (
    <ReportsClient 
      data={chartData} 
      summary={{ totalRevenue, totalExpense, profit, totalTx }} 
    />
  );
}
