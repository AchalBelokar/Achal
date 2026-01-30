
import React, { useState } from 'react';
import { useERP } from '../context';
import { Card, Button, Badge, Modal, Input } from '../components/Shared';
import { ICONS } from '../constants';

export const Inventory: React.FC = () => {
  const { products, addProduct } = useERP();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ sku: '', name: '', category: '', price: 0, costPrice: 0, stockQuantity: 0, lowStockThreshold: 5 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({ sku: '', name: '', category: '', price: 0, costPrice: 0, stockQuantity: 0, lowStockThreshold: 5 });
    setModalOpen(false);
  };

  const inventoryValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.costPrice), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
        <Button colorTheme="amber" onClick={() => setModalOpen(true)}>
          <ICONS.Add size={18} className="mr-2"/> New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Inventory Summary">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Total Valuation</p>
              <h3 className="text-2xl font-black text-amber-900">${inventoryValue.toLocaleString()}</h3>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Low Stock</p>
              <h3 className="text-2xl font-black text-slate-900">
                {products.filter(p => p.stockQuantity <= p.lowStockThreshold).length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2" title="Product List">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b">
                  <th className="pb-4 font-medium">SKU</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Stock</th>
                  <th className="pb-4 font-medium">Price</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="py-4 text-slate-500 text-sm">{product.sku}</td>
                    <td className="py-4 font-semibold text-slate-700">{product.name}</td>
                    <td className="py-4 font-bold">
                      <span className={product.stockQuantity <= product.lowStockThreshold ? 'text-rose-600' : 'text-slate-700'}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">${product.price}</td>
                    <td className="py-4">
                      {product.stockQuantity <= product.lowStockThreshold ? (
                        <Badge color="rose">Reorder</Badge>
                      ) : (
                        <Badge color="emerald">Healthy</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Input label="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} required />
          </div>
          <div className="col-span-1">
            <Input label="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
          </div>
          <div className="col-span-2">
            <Input label="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
          </div>
          <Input label="Selling Price ($)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
          <Input label="Cost Price ($)" type="number" value={newProduct.costPrice} onChange={e => setNewProduct({...newProduct, costPrice: Number(e.target.value)})} required />
          <Input label="Initial Stock" type="number" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})} required />
          <Input label="Low Stock Alert Level" type="number" value={newProduct.lowStockThreshold} onChange={e => setNewProduct({...newProduct, lowStockThreshold: Number(e.target.value)})} required />
          
          <div className="col-span-2 flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button colorTheme="amber" type="submit">Add Product</Button>
          </div>
        </form>
      </Modal>
      
      {/* 
        EXTENSIBILITY NOTE:
        Add multi-location/warehouse support by tracking stockQuantity per location.
        Add barcode scanning integration for quick stock updates.
      */}
    </div>
  );
};
