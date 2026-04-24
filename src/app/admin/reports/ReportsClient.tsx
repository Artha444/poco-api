"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";

type ChartData = { date: string; revenue: number; expense: number; txCount: number };
type Summary = { totalRevenue: number; totalExpense: number; profit: number; totalTx: number };

export default function ReportsClient({ data, summary }: { data: ChartData[], summary: Summary }) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const filteredData = useMemo(() => {
    if (period === "daily") return data;

    const grouped: Record<string, ChartData> = {};

    data.forEach(item => {
      const dateObj = parseISO(item.date);
      let key = "";
      if (period === "weekly") {
        key = format(startOfWeek(dateObj), "yyyy-MM-dd");
      } else if (period === "monthly") {
        key = format(startOfMonth(dateObj), "yyyy-MM");
      }

      if (!grouped[key]) {
        grouped[key] = { date: key, revenue: 0, expense: 0, txCount: 0 };
      }
      grouped[key].revenue += item.revenue;
      grouped[key].expense += item.expense;
      grouped[key].txCount += item.txCount;
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [data, period]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Reports</h1>
          <p className="text-gray-400">Overview of your store's revenue, expenses, and profit.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/10 rounded-xl">
          <button 
            onClick={() => setPeriod("daily")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'daily' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setPeriod("weekly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'weekly' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setPeriod("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'monthly' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-400">Rp {summary.totalRevenue.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
              <TrendingDown size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-400">Rp {summary.totalExpense.toLocaleString('id-ID')}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500">
              <DollarSign size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Net Profit</h3>
          <p className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-yellow-400' : 'text-red-500'}`}>
            Rp {summary.profit.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-400">{summary.totalTx} Sales</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[500px]">
        <h2 className="text-xl font-bold mb-6">Revenue vs Expense Chart</h2>
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" tickFormatter={(v) => {
                if (period === 'monthly') return format(parseISO(v + "-01"), 'MMM yyyy');
                return v;
              }} />
              <YAxis stroke="#888" tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#11151c', borderColor: '#333', borderRadius: '12px' }}
                formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                labelFormatter={(label) => {
                  if (period === 'monthly') return format(parseISO(label + "-01"), 'MMMM yyyy');
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No financial data available yet. Start selling or purchasing stock!
          </div>
        )}
      </div>
    </div>
  );
}
