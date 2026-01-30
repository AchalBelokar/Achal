
import React, { useState } from 'react';
import { useERP } from '../context';
import { Card, Button, Badge, Modal, Input, Select } from '../components/Shared';
import { ICONS } from '../constants';
import { OrderStatus, LineItem } from '../types';

export const Sales: React.FC = () => {
  const { customers, salesOrders, products, addCustomer, createSalesOrder, updateSalesOrderStatus } = useERP();
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  // Form states
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', company: '', address: '' });
  const [newOrder, setNewOrder] = useState({ customerId: '', items: [] as LineItem[] });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setNewCustomer({ name: '', contact: '', company: '', address: '' });
    setCustomerModalOpen(false);
  };

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stockQuantity <= 0) {
      alert("Out of stock!");
      return;
    }
    const existing = newOrder.items.find(i => i.productId === productId);
    if (existing) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i)
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { productId, name: product.name, quantity: 1, unitPrice: product.price, total: product.price }]
      });
    }
  };

  const handleCreateOrder = () => {
    if (!newOrder.customerId || newOrder.items.length === 0) return;
    const customer = customers.find(c => c.id === newOrder.customerId);
    const total = newOrder.items.reduce((sum, i) => sum + i.total, 0);
    createSalesOrder({
      customerId: newOrder.customerId,
      customerName: customer?.name || 'Unknown',
      date: new Date().toISOString(),
      items: newOrder.items,
      subtotal: total,
      totalAmount: total
    });
    setNewOrder({ customerId: '', items: [] });
    setOrderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Sales Management</h1>
        <div className="flex space-x-3">
          <Button colorTheme="emerald" variant="outline" onClick={() => setCustomerModalOpen(true)}>
            <ICONS.Customers size={18} className="mr-2"/> New Customer
          </Button>
          <Button colorTheme="emerald" onClick={() => setOrderModalOpen(true)}>
            <ICONS.Add size={18} className="mr-2"/> Create Sales Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3" title="Recent Sales Orders">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salesOrders.map(order => (
                  <tr key={order.id} className="group">
                    <td className="py-4 font-bold text-slate-700">{order.id}</td>
                    <td className="py-4 text-slate-600">{order.customerName}</td>
                    <td className="py-4 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4 font-semibold">${order.totalAmount}</td>
                    <td className="py-4">
                      <Badge color={
                        order.status === OrderStatus.DELIVERED ? 'emerald' : 
                        order.status === OrderStatus.CANCELLED ? 'rose' : 'amber'
                      }>{order.status}</Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        {order.status === OrderStatus.DRAFT && (
                          <Button size="sm" colorTheme="emerald" onClick={() => updateSalesOrderStatus(order.id, OrderStatus.CONFIRMED)}>Confirm</Button>
                        )}
                        {order.status === OrderStatus.CONFIRMED && (
                          <Button size="sm" colorTheme="blue" onClick={() => updateSalesOrderStatus(order.id, OrderStatus.DISPATCHED)}>Dispatch</Button>
                        )}
                        {order.status === OrderStatus.DISPATCHED && (
                          <Button size="sm" colorTheme="emerald" onClick={() => updateSalesOrderStatus(order.id, OrderStatus.DELIVERED)}>Complete</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {salesOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">No sales orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Customer Stats">
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-600 font-medium">Total Customers</p>
              <h3 className="text-2xl font-bold text-emerald-900">{customers.length}</h3>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 font-medium">Active Leads</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Customer Modal */}
      <Modal isOpen={isCustomerModalOpen} onClose={() => setCustomerModalOpen(false)} title="Add New Customer">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} required />
          <Input label="Company" placeholder="Acme Inc" value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} required />
          <Input label="Contact" placeholder="555-0000" value={newCustomer.contact} onChange={e => setNewCustomer({...newCustomer, contact: e.target.value})} required />
          <Input label="Address" placeholder="123 Street..." value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={() => setCustomerModalOpen(false)}>Cancel</Button>
            <Button colorTheme="emerald" type="submit">Save Customer</Button>
          </div>
        </form>
      </Modal>

      {/* Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} title="Create Sales Order">
        <div className="space-y-6">
          <Select 
            label="Select Customer" 
            options={[ {value: '', label: 'Select a customer'}, ...customers.map(c => ({ value: c.id, label: `${c.name} (${c.company})` }))]}
            value={newOrder.customerId}
            onChange={e => setNewOrder({...newOrder, customerId: e.target.value})}
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Add Items</label>
            <div className="grid grid-cols-2 gap-2">
              {products.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleAddItem(p.id)}
                  disabled={p.stockQuantity <= 0}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-slate-400">${p.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Order Items</h4>
            <div className="space-y-2">
              {newOrder.items.map(item => (
                <div key={item.productId} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                  <span className="text-sm">{item.name} x {item.quantity}</span>
                  <span className="font-medium">${item.total}</span>
                </div>
              ))}
              {newOrder.items.length === 0 && <p className="text-slate-400 text-xs italic">No items added.</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="ghost" onClick={() => setOrderModalOpen(false)}>Cancel</Button>
            <Button colorTheme="emerald" onClick={handleCreateOrder} disabled={!newOrder.customerId || newOrder.items.length === 0}>
              Create SO
            </Button>
          </div>
        </div>
      </Modal>

      {/* 
        EXTENSIBILITY NOTE:
        Add GST/Tax Calculation logic to handleCreateOrder.
        Implement automatic email notifications for confirmed orders.
      */}
    </div>
  );
};
