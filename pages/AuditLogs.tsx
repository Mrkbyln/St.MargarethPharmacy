
import React from 'react';
import { Shield, User, ShoppingCart, Settings, Package, Trash2, Edit } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

const AuditLogs: React.FC = () => {
  const { auditLogs } = usePharmacy();

  const getIcon = (action: string) => {
    if (action.includes('Login') || action.includes('User')) return <User size={20} />;
    if (action.includes('Sale')) return <ShoppingCart size={20} />;
    if (action.includes('Settings')) return <Settings size={20} />;
    if (action.includes('Delete')) return <Trash2 size={20} />;
    if (action.includes('Update') || action.includes('Adjustment')) return <Edit size={20} />;
    return <Package size={20} />;
  };

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-2xl font-extrabold text-slate-800">Audit & Logs</h2>
        <p className="text-slate-500 font-medium">System activity and transaction history</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No activity logs found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
              {auditLogs.map(log => (
                  <div key={log.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center transition-colors">
                      <div className="bg-slate-100 p-3 rounded-full text-slate-600 shrink-0">
                          {getIcon(log.action)}
                      </div>
                      <div className="flex-1 w-full">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-slate-800">{log.action}</h4>
                              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium break-words">{log.details}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-xs text-slate-400 font-mono bg-gray-50 px-1 rounded border border-gray-100">User: {log.user}</span>
                             <span className={`text-xs px-1.5 rounded uppercase font-bold ${log.role === 'admin' ? 'bg-amber-300 text-slate-900' : 'bg-blue-100 text-blue-700'}`}>{log.role}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
