import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Medicine, Sale, User, CartItem, SaleItem } from '../types';
import { INITIAL_MEDICINES } from '../constants';

interface PharmacyContextType {
  user: User | null;
  medicines: Medicine[];
  sales: Sale[];
  lowStockItems: Medicine[];
  expiredItems: Medicine[];
  currencySymbol: string;
  login: (username: string) => void;
  logout: () => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateStock: (id: string, newQty: number) => void;
  processSale: (cartItems: CartItem[]) => void;
  deleteMedicine: (id: string) => void;
  updateSettings: (settings: { currencySymbol: string }) => void;
  bulkDeleteMedicines: (ids: string[]) => void;
  bulkUpdateStock: (ids: string[], newQty: number) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pharmacy_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pharmacy_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('pharmacy_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    return localStorage.getItem('pharmacy_currency') || '$';
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
    localStorage.setItem('pharmacy_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharmacy_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pharmacy_currency', currencySymbol);
  }, [currencySymbol]);

  const login = (username: string) => {
    // Simulating db.php user check
    setUser({
      id: '1',
      username,
      role: 'admin',
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medData,
      id: Date.now().toString(),
    };
    setMedicines([...medicines, newMed]);
  };

  const updateStock = (id: string, newQty: number) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock_qty: newQty } : m));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const updateSettings = (settings: { currencySymbol: string }) => {
    setCurrencySymbol(settings.currencySymbol);
  };

  const bulkDeleteMedicines = (ids: string[]) => {
    setMedicines(prev => prev.filter(m => !ids.includes(m.id)));
  };

  const bulkUpdateStock = (ids: string[], newQty: number) => {
    setMedicines(prev => prev.map(m => ids.includes(m.id) ? { ...m, stock_qty: newQty } : m));
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

    // 1. Record Sale
    setSales(prev => [newSale, ...prev]);

    // 2. Deduct Stock
    setMedicines(prev => prev.map(med => {
      const cartItem = cartItems.find(c => c.id === med.id);
      if (cartItem) {
        return { ...med, stock_qty: med.stock_qty - cartItem.quantity };
      }
      return med;
    }));
  };

  return (
    <PharmacyContext.Provider value={{ 
      user, 
      medicines, 
      sales, 
      lowStockItems,
      expiredItems,
      currencySymbol,
      login, 
      logout, 
      addMedicine, 
      updateStock,
      processSale,
      deleteMedicine,
      updateSettings,
      bulkDeleteMedicines,
      bulkUpdateStock
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