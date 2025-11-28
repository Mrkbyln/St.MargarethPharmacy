
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { 
  AlertTriangle, 
  DollarSign, 
  Package, 
  ShoppingBag 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard: React.FC = () => {
  const { medicines, sales, lowStockItems, expiredItems, currencySymbol, user } = usePharmacy();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(s => s.sale_date.startsWith(today));
    const todayRevenue = todaySales.reduce((acc, curr) => acc + curr.total_amount, 0);

    return {
      totalMedicines: medicines.length,
      todayRevenue,
      lowStockCount: lowStockItems.length,
      expiredCount: expiredItems.length,
    };
  }, [medicines, sales, lowStockItems, expiredItems]);

  // Prepare data for chart (Revenue by Day - Last 7 entries or simulated)
  const chartData = useMemo(() => {
    // Group sales by date
    const grouped = sales.reduce((acc, sale) => {
      const date = sale.sale_date.split('T')[0];
      acc[date] = (acc[date] || 0) + sale.total_amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).slice(-7).map(date => ({
      name: date,
      revenue: grouped[date]
    }));
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:hidden">
        <h2 className="text-2xl font-extrabold text-slate-800">Dashboard</h2>
        <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
        <div 
          onClick={() => navigate('/inventory')}
          className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="p-3 bg-[var(--color-light)] rounded-lg text-[var(--color-text)] group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalMedicines}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-[var(--color-light)] rounded-lg text-[var(--color-text)]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Today's Revenue</p>
              <p className="text-2xl font-extrabold text-slate-900">{currencySymbol}{stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div 
          onClick={() => navigate('/stock')}
          className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="p-3 bg-orange-100 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.lowStockCount}</p>
          </div>
        </div>

        <div 
          onClick={() => navigate('/inventory')}
          className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="p-3 bg-red-100 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Expired</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.expiredCount}</p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)] lg:col-span-3">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Sales Overview</h3>
            <div className="h-64">
               {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'var(--color-light)' }}
                        formatter={(value: number) => [`${currencySymbol}${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>
               ) : (
                   <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                       No sales data available yet
                   </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
