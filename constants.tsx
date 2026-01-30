
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Truck, 
  Wallet, 
  Users, 
  Building2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const COLORS = {
  Sales: 'emerald',
  Purchase: 'blue',
  Inventory: 'amber',
  Finance: 'violet',
  Neutral: 'slate'
};

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Sales: <ShoppingCart size={20} />,
  Inventory: <Package size={20} />,
  Purchase: <Truck size={20} />,
  Finance: <Wallet size={20} />,
  Customers: <Users size={18} />,
  Vendors: <Building2 size={18} />,
  Add: <Plus size={18} />,
  In: <ArrowDownLeft size={18} className="text-emerald-500" />,
  Out: <ArrowUpRight size={18} className="text-rose-500" />,
  Alert: <AlertTriangle size={18} />,
  Search: <Search size={18} />,
  Filter: <Filter size={18} />,
  Success: <CheckCircle2 size={18} />,
  Pending: <Clock size={18} />,
  Error: <XCircle size={18} />,
  Received: <PackageCheck size={18} />,
  Profit: <TrendingUp size={18} />,
  Loss: <TrendingDown size={18} />
};
