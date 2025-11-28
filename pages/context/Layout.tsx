import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, AlertTriangle, AlertCircle, X, ChevronDown } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { lowStockItems, expiredItems, user } = usePharmacy();
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const totalAlerts = lowStockItems.length + expiredItems.length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const NotificationDropdown = ({ positionClass = "right-0" }: { positionClass?: string }) => (
    <div className={`absolute ${positionClass} top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right`}>
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-800">Notifications</h3>
        <button 
          onClick={() => setShowNotifications(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto">
        {totalAlerts === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Bell size={32} className="mb-2 opacity-20" />
            <p>No new notifications</p>
            <p className="text-xs">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {expiredItems.map(item => (
              <div key={`exp-${item.id}`} className="p-4 hover:bg-red-50/50 transition-colors flex gap-3 group">
                <div className="mt-1 bg-red-100 p-2 rounded-full h-fit shrink-0">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-red-600 font-medium">Expired on {item.expiry_date}</p>
                </div>
              </div>
            ))}
            
            {lowStockItems.map(item => (
              <div key={`stock-${item.id}`} className="p-4 hover:bg-orange-50/50 transition-colors flex gap-3">
                <div className="mt-1 bg-orange-100 p-2 rounded-full h-fit shrink-0">
                  <AlertTriangle size={16} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-orange-600 font-medium">Low Stock: Only {item.stock_qty} left</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {totalAlerts > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={() => {
              navigate('/inventory');
              setShowNotifications(false);
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline"
          >
            View Inventory
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#FCD34D] text-slate-900 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-extrabold text-lg">St. Margareth</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={24} />
              {totalAlerts > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#FCD34D]">
                  {totalAlerts}
                </span>
              )}
            </button>
            {/* Mobile Dropdown */}
            {showNotifications && <NotificationDropdown positionClass="right-0" />}
          </div>
        </div>
      </div>

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-72 flex flex-col h-screen overflow-hidden">
        
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-end px-8 py-5 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
           <div className="flex items-center gap-6">
             <div className="relative" ref={showNotifications ? notificationRef : null}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all"
                >
                  <Bell size={22} />
                  {totalAlerts > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                        {totalAlerts > 9 ? '!' : totalAlerts}
                    </span>
                  )}
                </button>
                {/* Desktop Dropdown */}
                {showNotifications && <NotificationDropdown positionClass="right-0" />}
             </div>
             
             <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-right hidden lg:block">
                   <p className="text-sm font-bold text-gray-800 leading-none">{user?.username || 'Admin User'}</p>
                   <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">Administrator</p>
                </div>
                <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold border-2 border-amber-200">
                   {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <ChevronDown size={16} className="text-gray-400" />
             </div>
           </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;