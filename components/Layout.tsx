
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, AlertTriangle, AlertCircle, X, ChevronDown, Package, Check, RefreshCw, LogOut, User as UserIcon } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

interface NotificationDropdownProps {
  positionClass?: string;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ positionClass = "right-0", onClose }) => {
  const { lowStockItems, expiredItems, readNotificationIds, markAllAsRead, markAllAsUnread } = usePharmacy();
  const navigate = useNavigate();

  const totalAlerts = lowStockItems.length + expiredItems.length;
  const unreadCount = [...lowStockItems, ...expiredItems].filter(item => !readNotificationIds.includes(item.id)).length;

  return (
    <div className={`absolute ${positionClass} top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right`}>
      <div className="p-4 border-b border-gray-100 flex flex-col gap-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount} new</span>}
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
        {totalAlerts > 0 && (
          <div className="flex gap-2 text-xs">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-[var(--color-text)] font-semibold transition-colors"
              type="button"
            >
              <Check size={12} /> Mark all read
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsUnread();
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-[var(--color-text)] font-semibold transition-colors"
              type="button"
            >
              <RefreshCw size={12} /> Mark all unread
            </button>
          </div>
        )}
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
        {totalAlerts === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Bell size={32} className="mb-2 opacity-20" />
            <p>No new notifications</p>
            <p className="text-xs">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {expiredItems.map(item => {
              const isRead = readNotificationIds.includes(item.id);
              return (
                <div 
                  key={`exp-${item.id}`} 
                  onClick={() => {
                    navigate('/inventory');
                    onClose();
                  }}
                  className={`p-4 transition-colors flex gap-3 group cursor-pointer ${isRead ? 'bg-gray-50 hover:bg-gray-100 opacity-70' : 'bg-white hover:bg-red-50/50'}`}
                >
                  <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${isRead ? 'bg-gray-200' : 'bg-red-100'}`}>
                    <AlertCircle size={16} className={`${isRead ? 'text-gray-500' : 'text-red-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <p className={`text-sm font-semibold transition-colors ${isRead ? 'text-gray-600' : 'text-gray-800 group-hover:text-red-700'}`}>{item.name}</p>
                       {!isRead && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                    </div>
                    <p className={`text-xs font-medium ${isRead ? 'text-gray-500' : 'text-red-600'}`}>Expired on {item.expiry_date}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Click to manage in Inventory</p>
                  </div>
                </div>
              );
            })}
            
            {lowStockItems.map(item => {
              const isRead = readNotificationIds.includes(item.id);
              return (
                <div 
                  key={`stock-${item.id}`} 
                  onClick={() => {
                    navigate('/stock');
                    onClose();
                  }}
                  className={`p-4 transition-colors flex gap-3 cursor-pointer group ${isRead ? 'bg-gray-50 hover:bg-gray-100 opacity-70' : 'bg-white hover:bg-orange-50/50'}`}
                >
                  <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${isRead ? 'bg-gray-200' : 'bg-orange-100'}`}>
                    <AlertTriangle size={16} className={`${isRead ? 'text-gray-500' : 'text-orange-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <p className={`text-sm font-semibold transition-colors ${isRead ? 'text-gray-600' : 'text-gray-800 group-hover:text-orange-700'}`}>{item.name}</p>
                       {!isRead && <span className="w-2 h-2 rounded-full bg-orange-500"></span>}
                    </div>
                    <p className={`text-xs font-medium ${isRead ? 'text-gray-500' : 'text-orange-600'}`}>Low Stock: Only {item.stock_qty} left</p>
                    <p className="text-[10px] text-gray-400 mt-1">Click to restock</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate('/inventory');
            onClose();
          }}
          type="button"
          className={`w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-slate-900 font-bold rounded-lg shadow-sm transition-colors text-xs uppercase tracking-wide flex items-center justify-center gap-2`}
        >
          <Package size={16} /> View Products
        </button>
      </div>
    </div>
  );
};

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { lowStockItems, expiredItems, user, pharmacyName, readNotificationIds, logout } = usePharmacy();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use separate refs for containers
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalAlerts = lowStockItems.length + expiredItems.length;
  const unreadCount = [...lowStockItems, ...expiredItems].filter(item => !readNotificationIds.includes(item.id)).length;

  // Helper to determine page title
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard';
      case '/inventory': return 'Products & Inventory';
      case '/pos': return 'Point of Sale';
      case '/stock': return 'Stock Management';
      case '/inventory-logs': return 'Inventory Logs';
      case '/reports': return 'Reports & Analytics';
      case '/audit': return 'Audit & Logs';
      case '/settings': return 'System Settings';
      case '/account': return 'My Account';
      default: return 'St. Margareth Pharmacy';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Notifications check
      const isMobileClick = mobileDropdownRef.current && mobileDropdownRef.current.contains(target);
      const isDesktopClick = desktopDropdownRef.current && desktopDropdownRef.current.contains(target);

      // User Menu check
      const isUserMenuClick = userMenuRef.current && userMenuRef.current.contains(target);

      // If click is outside notification dropdowns
      if (showNotifications && !isMobileClick && !isDesktopClick) {
        setShowNotifications(false);
      }

      // If click is outside user menu
      if (showUserMenu && !isUserMenuClick) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className={`md:hidden bg-[var(--color-primary)] text-slate-900 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-extrabold text-lg line-clamp-1">{pharmacyName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative" ref={mobileDropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className={`absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white/30`}>
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Mobile Dropdown */}
            {showNotifications && <NotificationDropdown positionClass="-right-14" onClose={() => setShowNotifications(false)} />}
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
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{pageTitle}</h1>

           <div className="flex items-center gap-6">
             <div className="relative" ref={desktopDropdownRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 text-gray-500 hover:bg-[var(--color-light)] hover:text-[var(--color-text)] rounded-xl transition-all`}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount > 9 ? '!' : unreadCount}
                    </span>
                  )}
                </button>
                {/* Desktop Dropdown */}
                {showNotifications && <NotificationDropdown positionClass="right-0" onClose={() => setShowNotifications(false)} />}
             </div>
             
             {/* User Profile Dropdown */}
             <div className="relative" ref={userMenuRef}>
               <button 
                 onClick={() => setShowUserMenu(!showUserMenu)}
                 className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer"
               >
                  <div className="text-right hidden lg:block">
                     <p className="text-sm font-bold text-gray-800 leading-none">{user?.username || 'Admin User'}</p>
                     <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wider">{user?.role === 'admin' ? 'Administrator' : 'Staff Member'}</p>
                  </div>
                  <div className={`h-10 w-10 bg-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-text)] font-bold border-2 border-[var(--color-light)]`}>
                     {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
               </button>

               {/* User Menu Dropdown */}
               {showUserMenu && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                    <div className="p-2">
                       <button 
                         onClick={() => {
                           navigate('/account');
                           setShowUserMenu(false);
                         }}
                         className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                       >
                         <UserIcon size={16} className="text-slate-400" /> My Account
                       </button>
                       <div className="my-1 border-t border-gray-100"></div>
                       <button 
                         onClick={handleLogout}
                         className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                       >
                         <LogOut size={16} /> Log Out
                       </button>
                    </div>
                 </div>
               )}
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
