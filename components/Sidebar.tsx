
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  X,
  TrendingUp,
  Warehouse,
  BarChart2,
  FileText,
  Settings,
  User
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { logout, pharmacyName, user } = usePharmacy();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  const navClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-4 px-6 py-3.5 mx-4 rounded-xl transition-all duration-200 font-bold ${
      isActive 
        ? 'bg-white text-slate-900 shadow-sm' 
        : 'text-slate-800 hover:bg-white/40'
    }`;

  // Close sidebar when clicking a link on mobile
  const handleNavClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-screen z-50 w-72 shadow-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 overflow-hidden font-sans
        bg-[var(--color-primary)]
      `}>
        {/* Header / Logo Section */}
        <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center">
          <div className="relative mb-3">
             <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-white shadow-lg">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvYjm-f4avjguimXMOIFhYhowYaROPwcuV-kt1SonwfTtZ9Ses1_AYy5g&s=10"
                  alt={pharmacyName}
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
          
          <h1 className="text-slate-900 font-extrabold text-xl leading-tight px-2">{pharmacyName}</h1>
          
          <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-slate-800 hover:bg-black/10 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto space-y-1 py-4 custom-scrollbar">
          <NavLink to="/dashboard" className={navClasses} onClick={handleNavClick}>
            <LayoutDashboard size={22} strokeWidth={2} />
            <span className="flex-1">Dashboard</span>
          </NavLink>
          
          {/* Products, POS, Stock - Hidden for Staff based on request "only have dashboard, inventory, report & account" */}
          {isAdmin && (
            <>
              <NavLink to="/inventory" className={navClasses} onClick={handleNavClick}>
                <Package size={22} strokeWidth={2} />
                <span>Products</span>
              </NavLink>

              <NavLink to="/pos" className={navClasses} onClick={handleNavClick}>
                <ShoppingCart size={22} strokeWidth={2} />
                <span>Point of Sale</span>
              </NavLink>

              <NavLink to="/stock" className={navClasses} onClick={handleNavClick}>
                <TrendingUp size={22} strokeWidth={2} />
                <span>Stock</span>
              </NavLink>
            </>
          )}

          <NavLink to="/inventory-logs" className={navClasses} onClick={handleNavClick}>
            <Warehouse size={22} strokeWidth={2} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/reports" className={navClasses} onClick={handleNavClick}>
            <BarChart2 size={22} strokeWidth={2} />
            <span>Reports & Analytics</span>
          </NavLink>

          {isAdmin && (
            <>
              <NavLink to="/audit" className={navClasses} onClick={handleNavClick}>
                <FileText size={22} strokeWidth={2} />
                <span>Audit & Logs</span>
              </NavLink>

              <div className="my-4 mx-8 border-t border-slate-900/10"></div>

              <NavLink to="/settings" className={navClasses} onClick={handleNavClick}>
                <Settings size={22} strokeWidth={2} />
                <span>Settings</span>
              </NavLink>
            </>
          )}

           <NavLink to="/account" className={navClasses} onClick={handleNavClick}>
            <User size={22} strokeWidth={2} />
            <span>Account</span>
          </NavLink>
        </div>

        {/* User / Logout */}
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-800 hover:text-red-600 transition-colors font-bold text-sm px-2"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
