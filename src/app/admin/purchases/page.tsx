import prisma from "@/lib/prisma";

export default async function AdminPurchases() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { date: 'desc' },
    include: {
      supplier: true,
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Purchases (Stock-In)</h1>
          <p className="text-gray-400">View and manage stock coming from suppliers.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Purchase ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Supplier</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {purchases.map(purchase => (
                <tr key={purchase.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">#{purchase.id.toString().padStart(6, '0')}</td>
                  <td className="p-4 text-gray-400">{new Date(purchase.date).toLocaleDateString()}</td>
                  <td className="p-4">{purchase.supplier.name}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {purchase.items.map(item => (
                        <div key={item.id} className="text-xs">
                          {item.quantity}x {item.product.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-yellow-400">Rp {purchase.totalAmount.toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No purchases found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
