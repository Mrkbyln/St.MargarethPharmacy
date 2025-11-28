
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

const data = [
  { name: 'Mon', sales: 4000, profit: 2400 },
  { name: 'Tue', sales: 3000, profit: 1398 },
  { name: 'Wed', sales: 2000, profit: 9800 },
  { name: 'Thu', sales: 2780, profit: 3908 },
  { name: 'Fri', sales: 1890, profit: 4800 },
  { name: 'Sat', sales: 2390, profit: 3800 },
  { name: 'Sun', sales: 3490, profit: 4300 },
];

const Reports: React.FC = () => {
  const { currencySymbol } = usePharmacy();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <div className="md:hidden mr-auto">
          <h2 className="text-2xl font-extrabold text-slate-800">Reports & Analytics</h2>
          <p className="text-slate-500 font-medium">Sales performance and financial insights</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center bg-white border border-gray-200 text-slate-600 font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={18} /> Last 7 Days
          </button>
          <button className="flex-1 sm:flex-none justify-center bg-slate-900 text-[var(--color-primary)] font-bold px-4 py-2 rounded-xl shadow-md hover:bg-slate-800 flex items-center gap-2">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">Weekly Sales Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} prefix={currencySymbol} />
                <Tooltip 
                  cursor={{fill: 'var(--color-light)'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`${currencySymbol}${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">Profit Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} prefix={currencySymbol} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`${currencySymbol}${value}`, 'Profit']}
                />
                <Line type="monotone" dataKey="profit" stroke="var(--color-text)" strokeWidth={3} dot={{r: 4, fill: 'var(--color-text)'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-light)] p-6 rounded-xl border border-[var(--color-border)]">
                <p className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wide">Total Revenue</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{currencySymbol}24,500.00</p>
                <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">↑ 12% vs last week</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Transactions</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">1,234</p>
                <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">Same as last week</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)]">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Average Basket</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{currencySymbol}19.85</p>
                <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1">↓ 2% vs last week</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
