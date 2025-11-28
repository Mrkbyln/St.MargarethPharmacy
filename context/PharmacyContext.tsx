
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Medicine, Sale, User, CartItem, SaleItem, AuditLog } from '../types';
import { INITIAL_MEDICINES } from '../constants';

interface PharmacyContextType {
  user: User | null;
  registeredUsers: User[];
  medicines: Medicine[];
  sales: Sale[];
  lowStockItems: Medicine[];
  expiredItems: Medicine[];
  auditLogs: AuditLog[];
  currencySymbol: string;
  themeColor: string;
  fontFamily: string;
  pharmacyName: string;
  readNotificationIds: string[];
  login: (user: User) => void;
  logout: () => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, updates: Partial<Medicine>) => void;
  updateStock: (id: string, newQty: number) => void;
  processSale: (cartItems: CartItem[]) => void;
  deleteMedicine: (id: string) => void;
  updateSettings: (settings: { currencySymbol?: string; themeColor?: string; fontFamily?: string; pharmacyName?: string }) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  markAllAsRead: () => void;
  markAllAsUnread: () => void;
  addAuditLog: (action: string, details: string) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pharmacy_user');
    return saved ? JSON.parse(saved) : null;
  });

  // User Management State
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pharmacy_users');
    return saved ? JSON.parse(saved) : [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin', email: 'admin@pharmacy.com' },
      { id: '2', username: 'staff', password: 'staff123', role: 'staff', email: 'staff@pharmacy.com' }
    ];
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pharmacy_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('pharmacy_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('pharmacy_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', action: 'System Init', details: 'System initialized', user: 'System', role: 'admin', timestamp: new Date().toLocaleString() }
    ];
  });

  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    return localStorage.getItem('pharmacy_currency') || '₱';
  });

  const [themeColor, setThemeColor] = useState<string>(() => {
    return localStorage.getItem('pharmacy_theme_color') || 'amber';
  });

  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem('pharmacy_font_family') || 'font-sans';
  });

  const [pharmacyName, setPharmacyName] = useState<string>(() => {
    return localStorage.getItem('pharmacy_name') || 'St. Margareth Pharmacy';
  });

  // Notification Read State
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pharmacy_read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Derived state for alerts
  const lowStockItems = useMemo(() => {
    return medicines.filter(m => m.stock_qty < 10);
  }, [medicines]);

  const expiredItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    return medicines.filter(m => new Date(m.expiry_date) < today);
  }, [medicines]);

  // Persist data
  useEffect(() => {
    localStorage.setItem('pharmacy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pharmacy_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('pharmacy_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharmacy_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pharmacy_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('pharmacy_currency', currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem('pharmacy_theme_color', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('pharmacy_font_family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('pharmacy_name', pharmacyName);
  }, [pharmacyName]);

  useEffect(() => {
    localStorage.setItem('pharmacy_read_notifications', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

  // Helper to add log
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      action,
      details,
      user: user?.username || 'System',
      role: user?.role || 'system',
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (userData: User) => {
    setUser(userData);
    // Directly using the userData passed in because state 'user' won't update immediately
    const newLog: AuditLog = {
      id: Date.now().toString(),
      action: 'User Login',
      details: `${userData.username} logged in successfully`,
      user: userData.username,
      role: userData.role,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const logout = () => {
    if (user) {
        addAuditLog('User Logout', `${user.username} logged out`);
    }
    setUser(null);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser = { ...userData, id: Date.now().toString() };
    setRegisteredUsers([...registeredUsers, newUser]);
    addAuditLog('User Created', `Created new user: ${userData.username} (${userData.role})`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setRegisteredUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    addAuditLog('Profile Update', `User updated profile details`);
  };

  const removeUser = (id: string) => {
    const userToRemove = registeredUsers.find(u => u.id === id);
    setRegisteredUsers(registeredUsers.filter(u => u.id !== id));
    addAuditLog('User Deleted', `Deleted user: ${userToRemove?.username || id}`);
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medData,
      id: Date.now().toString(),
    };
    setMedicines([...medicines, newMed]);
    addAuditLog('Inventory Add', `Added new medicine: ${medData.name}`);
  };

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    const medName = medicines.find(m => m.id === id)?.name || 'Item';
    addAuditLog('Inventory Update', `Updated details for: ${medName}`);
  };

  const updateStock = (id: string, newQty: number) => {
    const med = medicines.find(m => m.id === id);
    const oldQty = med ? med.stock_qty : 0;
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock_qty: newQty } : m));
    addAuditLog('Stock Adjustment', `Adjusted stock for ${med?.name}: ${oldQty} -> ${newQty}`);
  };

  const deleteMedicine = (id: string) => {
    const med = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    addAuditLog('Inventory Delete', `Deleted medicine: ${med?.name || id}`);
  };

  const updateSettings = (settings: { currencySymbol?: string; themeColor?: string; fontFamily?: string; pharmacyName?: string }) => {
    if (settings.currencySymbol) setCurrencySymbol(settings.currencySymbol);
    if (settings.themeColor) setThemeColor(settings.themeColor);
    if (settings.fontFamily) setFontFamily(settings.fontFamily);
    if (settings.pharmacyName) setPharmacyName(settings.pharmacyName);
    addAuditLog('Settings Update', 'System settings modified');
  };

  const processSale = (cartItems: CartItem[]) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const saleItems: SaleItem[] = cartItems.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      medicine_id: item.id,
      medicine_name: item.name,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));

    const newSale: Sale = {
      id: Date.now().toString(),
      total_amount: totalAmount,
      sale_date: new Date().toISOString(),
      items: saleItems
    };

    setSales(prev => [newSale, ...prev]);

    setMedicines(prev => prev.map(med => {
      const cartItem = cartItems.find(c => c.id === med.id);
      if (cartItem) {
        return { ...med, stock_qty: med.stock_qty - cartItem.quantity };
      }
      return med;
    }));

    // Audit Log for POS
    const itemSummary = cartItems.map(i => `${i.name} (x${i.quantity})`).join(', ');
    addAuditLog('POS Sale', `Sold ${cartItems.length} unique items. Total: ${currencySymbol}${totalAmount.toFixed(2)}. Items: ${itemSummary}`);
  };

  const markAllAsRead = () => {
    const allAlertIds = [...lowStockItems, ...expiredItems].map(item => item.id);
    setReadNotificationIds(allAlertIds);
  };

  const markAllAsUnread = () => {
    setReadNotificationIds([]);
  };

  return (
    <PharmacyContext.Provider value={{ 
      user, 
      registeredUsers,
      medicines, 
      sales, 
      lowStockItems, 
      expiredItems, 
      auditLogs,
      currencySymbol,
      themeColor,
      fontFamily,
      pharmacyName,
      readNotificationIds,
      login, 
      logout, 
      addMedicine, 
      updateMedicine,
      updateStock, 
      processSale, 
      deleteMedicine,
      updateSettings,
      addUser,
      updateUser,
      removeUser,
      markAllAsRead,
      markAllAsUnread,
      addAuditLog
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error("usePharmacy must be used within PharmacyProvider");
  return context;
};
