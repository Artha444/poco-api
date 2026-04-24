import prisma from "@/lib/prisma";
import { DollarSign, Package, ShoppingBag, TrendingUp, ShoppingCart } from "lucide-react";

export default async function AdminDashboard() {
  const [totalProducts, totalSales, salesData, recentSales] = await Promise.all([
    prisma.product.count(),
    prisma.sale.count(),
    prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.sale.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { user: true },
    }),
  ]);

  const revenue = salesData._sum.totalAmount || 0;

  const stats = [
    { label: "Total Revenue", value: `Rp ${revenue.toLocaleString('id-ID')}`, icon: DollarSign, color: "text-green-500" },
    { label: "Total Sales", value: totalSales.toString(), icon: ShoppingBag, color: "text-blue-500" },
    { label: "Products Catalog", value: totalProducts.toString(), icon: Package, color: "text-yellow-500" },
    { label: "Growth", value: "+12.5%", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Transaction ID</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Cashier</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentSales.map(sale => (
                  <tr key={sale.id} className="border-b border-white/5 last:border-0">
                    <td className="py-4">#{sale.id.toString().padStart(6, '0')}</td>
                    <td className="py-4 text-gray-400">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="py-4">{sale.user.username}</td>
                    <td className="py-4 text-right font-semibold text-yellow-400">Rp {sale.totalAmount.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
                {recentSales.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <a href="/admin/products" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-yellow-500" />
                <span className="font-medium">Manage Products</span>
              </div>
            </a>
            <a href="/pos" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-yellow-500" />
                <span className="font-medium">Open POS</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
