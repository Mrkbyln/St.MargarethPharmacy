
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { AlertTriangle, Check, Search, ArrowUp, ArrowDown, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import { Medicine } from '../types';

const Stock: React.FC = () => {
  const { medicines, updateStock, lowStockItems } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewItem, setViewItem] = useState<Medicine | null>(null);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockAdjust = (id: string, currentQty: number, amount: number) => {
    updateStock(id, Math.max(0, currentQty + amount));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:hidden">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Stock Management</h2>
          <p className="text-slate-500 font-medium">Monitor levels and perform adjustments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert Box */}
        <div className="lg:col-span-3 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-red-800 font-bold text-lg">Low Stock Alerts ({lowStockItems.length})</h3>
            <p className="text-red-600/80 text-sm font-medium mb-3">The following items are running low and need restocking immediately.</p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <span key={item.id} className="bg-white border border-red-200 text-red-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  {item.name}: {item.stock_qty}
                </span>
              ))}
              {lowStockItems.length === 0 && <span className="text-sm font-bold text-green-700 flex items-center gap-1"><Check size={14} /> Stock levels are healthy.</span>}
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-light)] text-slate-700 font-bold text-sm uppercase">
                <tr>
                  <th className="px-3 sm:px-6 py-4">Item Name</th>
                  <th className="px-3 sm:px-6 py-4 text-center sm:text-left">Stock</th>
                  <th className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="hidden lg:table-cell px-6 py-4 text-center whitespace-nowrap">Quick Adjust</th>
                  <th className="px-3 sm:px-6 py-4 text-right lg:hidden">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMedicines.map(med => (
                  <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 max-w-[140px] sm:max-w-none">
                      <p className="font-bold text-slate-800 truncate">{med.name}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{med.category}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-center sm:text-left">
                      <span className={`font-bold text-lg ${med.stock_qty < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                        {med.stock_qty}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      {med.stock_qty === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider border border-red-200">
                          <XCircle size={12} strokeWidth={3} /> Out of Stock
                        </span>
                      ) : med.stock_qty < 10 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider border border-orange-200">
                          <AlertTriangle size={12} strokeWidth={3} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider border border-green-200">
                          <CheckCircle size={12} strokeWidth={3} /> In Stock
                        </span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleStockAdjust(med.id, med.stock_qty, -1)}
                          className="p-1.5 bg-gray-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                          title="Remove 1"
                        >
                          <ArrowDown size={16} />
                        </button>
                        <button 
                          onClick={() => handleStockAdjust(med.id, med.stock_qty, 10)}
                          className="p-1.5 bg-gray-100 hover:bg-[var(--color-light)] text-slate-600 hover:text-[var(--color-text)] rounded-lg transition-colors font-bold text-xs w-8"
                          title="Add 10"
                        >
                          +10
                        </button>
                        <button 
                          onClick={() => handleStockAdjust(med.id, med.stock_qty, 1)}
                          className="p-1.5 bg-gray-100 hover:bg-green-100 text-slate-600 hover:text-green-600 rounded-lg transition-colors"
                          title="Add 1"
                        >
                          <ArrowUp size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right whitespace-nowrap lg:hidden">
                       <button 
                         onClick={() => setViewItem(med)}
                         className="p-2 text-slate-400 hover:text-[var(--color-text)] hover:bg-[var(--color-light)] rounded-lg"
                       >
                         <Eye size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Details Modal for Mobile/Details View - Rendered via Portal */}
      {viewItem && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             <div className="bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center text-slate-900">
                <h3 className="font-extrabold text-lg">Stock Details</h3>
                <button onClick={() => setViewItem(null)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
             </div>
             <div className="p-6 space-y-6">
                <div>
                   <h4 className="font-bold text-slate-900 text-xl">{viewItem.name}</h4>
                   <p className="text-slate-500 font-medium">{viewItem.category}</p>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                   <span className="text-sm font-bold text-slate-500 uppercase">Current Stock</span>
                   <span className={`text-3xl font-extrabold ${viewItem.stock_qty < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                      {viewItem.stock_qty}
                   </span>
                </div>

                <div className="flex justify-center">
                   {viewItem.stock_qty === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-bold rounded-full uppercase tracking-wider border border-red-200">
                        <XCircle size={16} /> Out of Stock
                      </span>
                    ) : viewItem.stock_qty < 10 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-full uppercase tracking-wider border border-orange-200">
                        <AlertTriangle size={16} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full uppercase tracking-wider border border-green-200">
                        <CheckCircle size={16} /> In Stock
                      </span>
                    )}
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Quick Adjust</label>
                   <div className="grid grid-cols-3 gap-3">
                      <button 
                         onClick={() => handleStockAdjust(viewItem.id, viewItem.stock_qty, -1)}
                         className="flex flex-col items-center justify-center py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors"
                       >
                         <ArrowDown size={20} className="mb-1" /> -1
                       </button>
                       <button 
                         onClick={() => handleStockAdjust(viewItem.id, viewItem.stock_qty, 10)}
                         className="flex flex-col items-center justify-center py-3 bg-[var(--color-light)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-xl font-bold transition-colors"
                       >
                         <span className="text-lg mb-0.5">+10</span>
                       </button>
                       <button 
                         onClick={() => handleStockAdjust(viewItem.id, viewItem.stock_qty, 1)}
                         className="flex flex-col items-center justify-center py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold transition-colors"
                       >
                         <ArrowUp size={20} className="mb-1" /> +1
                       </button>
                   </div>
                </div>

                <button 
                  onClick={() => setViewItem(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md mt-4"
                >
                  Done
                </button>
             </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Stock;
