"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye, Filter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function HistoryClient({ initialSales }: { initialSales: any[] }) {
  const [sales, setSales] = useState(initialSales);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  const filteredSales = dateFilter 
    ? sales.filter(s => new Date(s.date).toISOString().split('T')[0] === dateFilter)
    : sales;

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Purchase History</h1>
          <p className="text-gray-400">View all customer transactions and receipts.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <Filter size={18} className="text-gray-400" />
          <input 
            type="date" 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm text-gray-300 outline-none"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className="text-xs text-yellow-500 font-bold ml-2">Clear</button>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 text-gray-400 text-sm">
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Payment Method</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-300">#{sale.id.toString().padStart(6, '0')}</td>
                  <td className="p-4">{format(new Date(sale.date), "dd MMM yyyy, HH:mm")}</td>
                  <td className="p-4">
                    <p className="font-bold">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">{sale.customerPhone}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/10">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-yellow-400">Rp {sale.totalAmount.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedSale(sale)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors inline-flex"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#11151c] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h2 className="text-xl font-bold">Receipt #{selectedSale.id.toString().padStart(6, '0')}</h2>
                <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer Info</p>
                    <p className="font-bold">{selectedSale.customerName}</p>
                    <p className="text-sm text-gray-400">{selectedSale.customerPhone}</p>
                    <p className="text-sm text-gray-400 mt-1">{selectedSale.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction Details</p>
                    <p className="text-sm text-gray-300">Date: {format(new Date(selectedSale.date), "dd MMM yyyy, HH:mm")}</p>
                    <p className="text-sm text-gray-300">Cashier: {selectedSale.user.username}</p>
                    <p className="text-sm text-gray-300 mt-1 font-semibold text-yellow-500">Method: {selectedSale.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-3 border-b border-white/10 pb-2">Items Purchased</h3>
                  <div className="space-y-3">
                    {selectedSale.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-bold text-xs">{item.quantity}x</span>
                          <span>{item.product.name}</span>
                        </div>
                        <span className="font-mono text-gray-300">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total Paid</span>
                <span className="text-2xl font-black text-yellow-400">Rp {selectedSale.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
