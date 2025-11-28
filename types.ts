
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  password?: string;
  email?: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_qty: number;
  expiry_date: string; // YYYY-MM-DD
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface SaleItem {
  id: string;
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  total_amount: number;
  sale_date: string;
  items: SaleItem[];
}

export interface DashboardStats {
  totalMedicines: number;
  todaySales: number;
  lowStockCount: number;
  expiredCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
  role: string;
}
