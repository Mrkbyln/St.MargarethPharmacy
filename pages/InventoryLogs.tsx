
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardList, ArrowUpRight, ArrowDownLeft, Eye, X } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

const InventoryLogs: React.FC = () => {
  const { auditLogs } = usePharmacy();
  
  const MOCK_LOGS = [
    { id: 1, item: 'Amoxicillin 500mg', type: 'Restock', qty: 50, user: 'Admin', date: '2023-10-25 10:30 AM' },
    { id: 2, item: 'Paracetamol 500mg', type: 'Sale', qty: 2, user: 'Admin', date: '2023-10-25 11:15 AM' },
    { id: 3, item: 'Ibuprofen 400mg', type: 'Adjustment', qty: -5, user: 'Manager', date: '2023-10-24 04:00 PM' },
    { id: 4, item: 'Cough Syrup 100ml', type: 'Restock', qty: 20, user: 'Admin', date: '2023-10-24 09:00 AM' },
    { id: 5, item: 'Vitamin C 500mg', type: 'Sale', qty: 1, user: 'Staff', date: '2023-10-23 02:30 PM' },
  ];

  const [viewLog, setViewLog] = useState<typeof MOCK_LOGS[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:hidden">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Inventory Logs</h2>
          <p className="text-slate-500 font-medium">Track stock movements and history</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-full">
            <thead className="bg-[var(--color-light)] text-slate-700 font-bold text-sm uppercase">
              <tr>
                <th className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap w-1/5">Timestamp</th>
                <th className="px-3 sm:px-6 py-4 whitespace-nowrap w-2/5 md:w-auto">Item Name</th>
                <th className="hidden lg:table-cell px-4 md:px-6 py-4 whitespace-nowrap">Movement Type</th>
                <th className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-center md:text-left">Qty</th>
                <th className="hidden lg:table-cell px-4 md:px-6 py-4 whitespace-nowrap">Performed By</th>
                <th className="px-3 sm:px-6 py-4 text-right w-16 lg:hidden">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="px-3 sm:px-6 py-4 font-bold text-slate-800 whitespace-nowrap max-w-[140px] md:max-w-none overflow-hidden text-ellipsis">
                    {log.item}
                    <div className="md:hidden text-[10px] text-slate-400 font-normal mt-0.5 truncate">{log.date}</div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      log.type === 'Restock' ? 'bg-green-100 text-green-700' :
                      log.type === 'Sale' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {log.type === 'Restock' ? <ArrowUpRight size={14} /> : 
                       log.type === 'Sale' ? <ArrowDownLeft size={14} /> : 
                       <ClipboardList size={14} />}
                      {log.type}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4 font-bold text-slate-700 whitespace-nowrap text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start">
                        <span>{log.type === 'Restock' ? '+' : ''}{log.qty}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                    <span className="w-6 h-6 bg-slate-100 rounded-full inline-flex items-center justify-center text-xs mr-2 font-bold text-slate-500">
                      {log.user.charAt(0)}
                    </span>
                    {log.user}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right lg:hidden">
                     <button 
                       onClick={() => setViewLog(log)}
                       className="p-2 text-slate-400 hover:text-[var(--color-text)] hover:bg-[var(--color-light)] rounded-lg transition-colors"
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

      {/* Log Details Modal - Rendered via Portal */}
      {viewLog && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             <div className="bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center text-slate-900">
                <h3 className="font-extrabold text-lg">Log Details #{viewLog.id}</h3>
                <button onClick={() => setViewLog(null)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Name</label>
                   <p className="text-lg font-bold text-slate-900">{viewLog.item}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          viewLog.type === 'Restock' ? 'bg-green-100 text-green-700' :
                          viewLog.type === 'Sale' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {viewLog.type}
                        </span>
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                      <p className="font-bold text-slate-900 text-lg mt-1">{viewLog.qty}</p>
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</label>
                   <p className="font-medium text-slate-700">{viewLog.date}</p>
                </div>
                
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performed By</label>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                         {viewLog.user.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{viewLog.user}</span>
                   </div>
                </div>

                <button 
                  onClick={() => setViewLog(null)}
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl mt-4"
                >
                  Close
                </button>
             </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default InventoryLogs;
