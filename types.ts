
export enum OrderStatus {
  DRAFT = 'Draft',
  CONFIRMED = 'Confirmed',
  DISPATCHED = 'Dispatched',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  SENT = 'Sent',
  RECEIVED = 'Received',
  PARTIALLY_RECEIVED = 'Partially Received'
}

export enum TransactionType {
  SALES = 'Sales',
  PURCHASE = 'Purchase',
  PAYMENT_IN = 'Payment In',
  PAYMENT_OUT = 'Payment Out',
  STOCK_ADJUSTMENT = 'Stock Adjustment'
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  company: string;
  address: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  company: string;
  paymentTerms: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface LineItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesOrder {
  id: string; // SO-001
  customerId: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: LineItem[];
  subtotal: number;
  totalAmount: number;
  paidAmount: number;
}

export interface PurchaseOrder {
  id: string; // PO-001
  vendorId: string;
  vendorName: string;
  date: string;
  status: OrderStatus;
  items: LineItem[];
  totalAmount: number;
  paidAmount: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  reference: string; // SO-001, PO-001, etc.
  type: TransactionType;
  debit: number;
  credit: number;
  balance: number;
}

export interface ERPState {
  customers: Customer[];
  vendors: Vendor[];
  products: Product[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  ledger: LedgerEntry[];
}
