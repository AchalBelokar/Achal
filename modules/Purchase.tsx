
import React, { useState } from 'react';
import { useERP } from '../context';
import { Card, Button, Badge, Modal, Input, Select } from '../components/Shared';
import { ICONS } from '../constants';
import { OrderStatus, LineItem } from '../types';

export const Purchase: React.FC = () => {
  const { vendors, purchaseOrders, products, addVendor, createPurchaseOrder, updatePurchaseOrderStatus } = useERP();
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const [newVendor, setNewVendor] = useState({ name: '', contact: '', company: '', paymentTerms: 'Net 30' });
  const [newOrder, setNewOrder] = useState({ vendorId: '', items: [] as LineItem[] });

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    addVendor(newVendor);
    setNewVendor({ name: '', contact: '', company: '', paymentTerms: 'Net 30' });
    setVendorModalOpen(false);
  };

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = newOrder.items.find(i => i.productId === productId);
    if (existing) {
      setNewOrder({
        ...newOrder,
        items: newOrder.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i)
      });
    } else {
      setNewOrder({
        ...newOrder,
        items: [...newOrder.items, { productId, name: product.name, quantity: 1, unitPrice: product.costPrice, total: product.costPrice }]
      });
    }
  };

  const handleCreateOrder = () => {
    if (!newOrder.vendorId || newOrder.items.length === 0) return;
    const vendor = vendors.find(v => v.id === newOrder.vendorId);
    const total = newOrder.items.reduce((sum, i) => sum + i.total, 0);
    createPurchaseOrder({
      vendorId: newOrder.vendorId,
      vendorName: vendor?.name || 'Unknown',
      date: new Date().toISOString(),
      items: newOrder.items,
      totalAmount: total
    });
    setNewOrder({ vendorId: '', items: [] });
    setOrderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Purchase Management</h1>
        <div className="flex space-x-3">
          <Button colorTheme="blue" variant="outline" onClick={() => setVendorModalOpen(true)}>
            <ICONS.Vendors size={18} className="mr-2"/> New Vendor
          </Button>
          <Button colorTheme="blue" onClick={() => setOrderModalOpen(true)}>
            <ICONS.Add size={18} className="mr-2"/> Create Purchase Order
          </Button>
        </div>
      </div>

      <Card title="Purchase Orders">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b">
                <th className="pb-4 font-medium">PO ID</th>
                <th className="pb-4 font-medium">Vendor</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {purchaseOrders.map(order => (
                <tr key={order.id}>
                  <td className="py-4 font-bold text-slate-700">{order.id}</td>
                  <td className="py-4 text-slate-600">{order.vendorName}</td>
                  <td className="py-4 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-4 font-semibold">${order.totalAmount}</td>
                  <td className="py-4">
                    <Badge color={order.status === OrderStatus.RECEIVED ? 'emerald' : 'blue'}>{order.status}</Badge>
                  </td>
                  <td className="py-4">
                    {order.status === OrderStatus.DRAFT && (
                      <Button size="sm" colorTheme="blue" onClick={() => updatePurchaseOrderStatus(order.id, OrderStatus.SENT)}>Mark as Sent</Button>
                    )}
                    {order.status === OrderStatus.SENT && (
                      <Button size="sm" colorTheme="emerald" onClick={() => updatePurchaseOrderStatus(order.id, OrderStatus.RECEIVED)}>Receive Goods</Button>
                    )}
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">No purchase orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Vendor Modal */}
      <Modal isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} title="Add New Vendor">
        <form onSubmit={handleAddVendor} className="space-y-4">
          <Input label="Vendor Name" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} required />
          <Input label="Company" value={newVendor.company} onChange={e => setNewVendor({...newVendor, company: e.target.value})} required />
          <Input label="Contact" value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact: e.target.value})} required />
          <Select label="Payment Terms" options={[{value: 'Net 30', label: 'Net 30'}, {value: 'Net 15', label: 'Net 15'}, {value: 'Immediate', label: 'Immediate'}]} value={newVendor.paymentTerms} onChange={e => setNewVendor({...newVendor, paymentTerms: e.target.value})} />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={() => setVendorModalOpen(false)}>Cancel</Button>
            <Button colorTheme="blue" type="submit">Save Vendor</Button>
          </div>
        </form>
      </Modal>

      {/* Order Modal */}
      <Modal isOpen={isOrderModalOpen} onClose={() => setOrderModalOpen(false)} title="Create Purchase Order">
        <div className="space-y-6">
          <Select 
            label="Select Vendor" 
            options={[{value: '', label: 'Select a vendor'}, ...vendors.map(v => ({ value: v.id, label: v.name }))]}
            value={newOrder.vendorId}
            onChange={e => setNewOrder({...newOrder, vendorId: e.target.value})}
          />
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Add Items (uses Cost Price)</label>
            <div className="grid grid-cols-2 gap-2">
              {products.map(p => (
                <button 
                  key={p.id}
                  onClick={() => handleAddItem(p.id)}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-slate-400">Cost: ${p.costPrice}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Selected Items</h4>
            <div className="space-y-2">
              {newOrder.items.map(item => (
                <div key={item.productId} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                  <span className="text-sm">{item.name} x {item.quantity}</span>
                  <span className="font-medium">${item.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="ghost" onClick={() => setOrderModalOpen(false)}>Cancel</Button>
            <Button colorTheme="blue" onClick={handleCreateOrder} disabled={!newOrder.vendorId || newOrder.items.length === 0}>Create PO</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
