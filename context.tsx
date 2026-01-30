
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  ERPState, 
  Customer, 
  Vendor, 
  Product, 
  SalesOrder, 
  PurchaseOrder, 
  LedgerEntry, 
  OrderStatus, 
  TransactionType 
} from './types';

interface ERPContextType extends ERPState {
  // Sales
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  createSalesOrder: (order: Omit<SalesOrder, 'id' | 'status' | 'paidAmount'>) => void;
  updateSalesOrderStatus: (orderId: string, status: OrderStatus) => void;
  recordSalesPayment: (orderId: string, amount: number) => void;
  
  // Purchase
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => void;
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'status' | 'paidAmount'>) => void;
  updatePurchaseOrderStatus: (orderId: string, status: OrderStatus) => void;
  recordPurchasePayment: (orderId: string, amount: number) => void;
  
  // Inventory
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductStock: (productId: string, quantity: number, type: 'in' | 'out', ref: string) => void;
  
  // Search
  crossModuleSearch: (query: string) => any;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const INITIAL_DATA: ERPState = {
  customers: [
    { id: 'CUST-001', name: 'Alice Johnson', contact: '555-0101', company: 'Alice Tech', address: '123 Apple St', createdAt: new Date().toISOString() },
    { id: 'CUST-002', name: 'Bob Smith', contact: '555-0102', company: 'Bob\'s Builders', address: '456 Birch Ave', createdAt: new Date().toISOString() },
    { id: 'CUST-003', name: 'Charlie Davis', contact: '555-0103', company: 'Charlie Consulting', address: '789 Cedar Rd', createdAt: new Date().toISOString() },
    { id: 'CUST-004', name: 'David Wilson', contact: '555-0104', company: 'Wilson Corp', address: '321 Elm Dr', createdAt: new Date().toISOString() },
    { id: 'CUST-005', name: 'Eve Brown', contact: '555-0105', company: 'Eve Enterprises', address: '654 Fir Ln', createdAt: new Date().toISOString() },
  ],
  vendors: [
    { id: 'VEND-001', name: 'SupplyCo', contact: '555-1001', company: 'SupplyCo Inc', paymentTerms: 'Net 30', createdAt: new Date().toISOString() },
    { id: 'VEND-002', name: 'TechParts', contact: '555-1002', company: 'TechParts Ltd', paymentTerms: 'Net 15', createdAt: new Date().toISOString() },
    { id: 'VEND-003', name: 'GlobalGoods', contact: '555-1003', company: 'Global Goods Co', paymentTerms: 'Immediate', createdAt: new Date().toISOString() },
    { id: 'VEND-004', name: 'LocalMart', contact: '555-1004', company: 'Local Mart Wholesalers', paymentTerms: 'Net 30', createdAt: new Date().toISOString() },
    { id: 'VEND-005', name: 'PrimeDist', contact: '555-1005', company: 'Prime Distribution', paymentTerms: 'Net 60', createdAt: new Date().toISOString() },
  ],
  products: [
    { id: 'PROD-001', sku: 'LAP-001', name: 'Elite Laptop', category: 'Computers', price: 1200, costPrice: 800, stockQuantity: 15, lowStockThreshold: 5 },
    { id: 'PROD-002', sku: 'MOU-001', name: 'Wireless Mouse', category: 'Accessories', price: 25, costPrice: 10, stockQuantity: 50, lowStockThreshold: 10 },
    { id: 'PROD-003', sku: 'KEY-001', name: 'Mechanical Keyboard', category: 'Accessories', price: 80, costPrice: 40, stockQuantity: 30, lowStockThreshold: 8 },
    { id: 'PROD-004', sku: 'MON-001', name: '4K Monitor', category: 'Displays', price: 400, costPrice: 280, stockQuantity: 12, lowStockThreshold: 4 },
    { id: 'PROD-005', sku: 'USB-001', name: 'USB-C Cable', category: 'Cables', price: 15, costPrice: 5, stockQuantity: 100, lowStockThreshold: 20 },
    { id: 'PROD-006', sku: 'DES-001', name: 'Standing Desk', category: 'Furniture', price: 500, costPrice: 350, stockQuantity: 8, lowStockThreshold: 2 },
    { id: 'PROD-007', sku: 'CHA-001', name: 'Ergonomic Chair', category: 'Furniture', price: 300, costPrice: 180, stockQuantity: 20, lowStockThreshold: 5 },
    { id: 'PROD-008', sku: 'HED-001', name: 'Noise Cancelling Headset', category: 'Audio', price: 150, costPrice: 90, stockQuantity: 25, lowStockThreshold: 5 },
    { id: 'PROD-009', sku: 'CAM-001', name: '1080p Webcam', category: 'Audio/Video', price: 60, costPrice: 35, stockQuantity: 40, lowStockThreshold: 10 },
    { id: 'PROD-010', sku: 'ROU-001', name: 'WiFi 6 Router', category: 'Networking', price: 120, costPrice: 70, stockQuantity: 18, lowStockThreshold: 5 },
  ],
  salesOrders: [],
  purchaseOrders: [],
  ledger: []
};

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ERPState>(() => {
    const saved = localStorage.getItem('zenerp_state');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('zenerp_state', JSON.stringify(state));
  }, [state]);

  const addLedgerEntry = useCallback((entry: Omit<LedgerEntry, 'id' | 'balance'>) => {
    setState(prev => {
      const lastBalance = prev.ledger.length > 0 ? prev.ledger[prev.ledger.length - 1].balance : 0;
      const newBalance = lastBalance + entry.credit - entry.debit;
      const newEntry: LedgerEntry = {
        ...entry,
        id: `LDG-${Date.now()}`,
        balance: newBalance
      };
      return { ...prev, ledger: [...prev.ledger, newEntry] };
    });
  }, []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer = {
      ...customer,
      id: `CUST-${String(state.customers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  };

  const addVendor = (vendor: Omit<Vendor, 'id' | 'createdAt'>) => {
    const newVendor = {
      ...vendor,
      id: `VEND-${String(state.vendors.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, vendors: [...prev.vendors, newVendor] }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: `PROD-${String(state.products.length + 1).padStart(3, '0')}`
    };
    setState(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProductStock = (productId: string, quantity: number, type: 'in' | 'out', ref: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId 
          ? { ...p, stockQuantity: type === 'in' ? p.stockQuantity + quantity : p.stockQuantity - quantity }
          : p
      )
    }));
    // Could add stock adjustment ledger entry here if needed
  };

  const createSalesOrder = (order: Omit<SalesOrder, 'id' | 'status' | 'paidAmount'>) => {
    const id = `SO-${String(state.salesOrders.length + 1).padStart(3, '0')}`;
    const newOrder: SalesOrder = {
      ...order,
      id,
      status: OrderStatus.DRAFT,
      paidAmount: 0
    };
    setState(prev => ({ ...prev, salesOrders: [...prev.salesOrders, newOrder] }));
  };

  const updateSalesOrderStatus = (orderId: string, status: OrderStatus) => {
    setState(prev => {
      const order = prev.salesOrders.find(o => o.id === orderId);
      if (!order) return prev;

      // Logic: Confirming or Dispatching reduces stock
      if (status === OrderStatus.DISPATCHED && order.status !== OrderStatus.DISPATCHED) {
        order.items.forEach(item => {
          const product = prev.products.find(p => p.id === item.productId);
          if (product) {
            product.stockQuantity -= item.quantity;
          }
        });
        
        // Post to Ledger: Receivable
        addLedgerEntry({
          date: new Date().toISOString(),
          description: `Sales Order ${order.id} for ${order.customerName}`,
          reference: order.id,
          type: TransactionType.SALES,
          debit: 0,
          credit: order.totalAmount
        });
      }

      return {
        ...prev,
        salesOrders: prev.salesOrders.map(o => o.id === orderId ? { ...o, status } : o)
      };
    });
  };

  const recordSalesPayment = (orderId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      salesOrders: prev.salesOrders.map(o => o.id === orderId ? { ...o, paidAmount: o.paidAmount + amount } : o)
    }));
    const order = state.salesOrders.find(o => o.id === orderId);
    if (order) {
      addLedgerEntry({
        date: new Date().toISOString(),
        description: `Payment received for ${order.id}`,
        reference: order.id,
        type: TransactionType.PAYMENT_IN,
        debit: 0,
        credit: amount
      });
    }
  };

  const createPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'status' | 'paidAmount'>) => {
    const id = `PO-${String(state.purchaseOrders.length + 1).padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      ...order,
      id,
      status: OrderStatus.DRAFT,
      paidAmount: 0
    };
    setState(prev => ({ ...prev, purchaseOrders: [...prev.purchaseOrders, newOrder] }));
  };

  const updatePurchaseOrderStatus = (orderId: string, status: OrderStatus) => {
    setState(prev => {
      const order = prev.purchaseOrders.find(o => o.id === orderId);
      if (!order) return prev;

      // Logic: Receiving adds stock
      if (status === OrderStatus.RECEIVED && order.status !== OrderStatus.RECEIVED) {
        order.items.forEach(item => {
          const product = prev.products.find(p => p.id === item.productId);
          if (product) {
            product.stockQuantity += item.quantity;
          }
        });

        // Post to Ledger: Payable
        addLedgerEntry({
          date: new Date().toISOString(),
          description: `Purchase Order ${order.id} from ${order.vendorName}`,
          reference: order.id,
          type: TransactionType.PURCHASE,
          debit: order.totalAmount,
          credit: 0
        });
      }

      return {
        ...prev,
        purchaseOrders: prev.purchaseOrders.map(o => o.id === orderId ? { ...o, status } : o)
      };
    });
  };

  const recordPurchasePayment = (orderId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders.map(o => o.id === orderId ? { ...o, paidAmount: o.paidAmount + amount } : o)
    }));
    const order = state.purchaseOrders.find(o => o.id === orderId);
    if (order) {
      addLedgerEntry({
        date: new Date().toISOString(),
        description: `Payment sent for ${order.id}`,
        reference: order.id,
        type: TransactionType.PAYMENT_OUT,
        debit: amount,
        credit: 0
      });
    }
  };

  const crossModuleSearch = (query: string) => {
    const q = query.toLowerCase();
    return {
      customers: state.customers.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)),
      salesOrders: state.salesOrders.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)),
      purchaseOrders: state.purchaseOrders.filter(o => o.id.toLowerCase().includes(q) || o.vendorName.toLowerCase().includes(q)),
      products: state.products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    };
  };

  return (
    <ERPContext.Provider value={{
      ...state,
      addCustomer,
      createSalesOrder,
      updateSalesOrderStatus,
      recordSalesPayment,
      addVendor,
      createPurchaseOrder,
      updatePurchaseOrderStatus,
      recordPurchasePayment,
      addProduct,
      updateProductStock,
      crossModuleSearch
    }}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
