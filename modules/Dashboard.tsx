
import React from 'react';
import { useERP } from '../context';
import { Card, StatCard, Badge } from '../components/Shared';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Dashboard: React.FC = () => {
  const { salesOrders, purchaseOrders, products, ledger } = useERP();

  const totalRevenue = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPurchase = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const cashFlow = ledger.reduce((sum, entry) => sum + (entry.credit - entry.debit), 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= p.lowStockThreshold).length;

  const chartData = [
    { name: 'Sales', amount: totalRevenue },
    { name: 'Purchase', amount: totalPurchase }
  ];

  // Mock monthly data
  const monthlyData = [
    { name: 'Jan', sales: 4000, purchase: 2400 },
    { name: 'Feb', sales: 3000, purchase: 1398 },
    { name: 'Mar', sales: 2000, purchase: 9800 },
    { name: 'Apr', sales: 2780, purchase: 3908 },
    { name: 'May', sales: 1890, purchase: 4800 },
    { name: 'Jun', sales: 2390, purchase: 3800 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500">Here's what's happening with your business today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">Date</p>
          <p className="text-lg font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<ICONS.Sales size={24}/>} trend={12} color="emerald" />
        <StatCard title="Purchases" value={`$${totalPurchase.toLocaleString()}`} icon={<ICONS.Purchase size={24}/>} trend={-5} color="blue" />
        <StatCard title="Cash Balance" value={`$${cashFlow.toLocaleString()}`} icon={<ICONS.Finance size={24}/>} color="purple" />
        <StatCard title="Low Stock Items" value={lowStockCount} icon={<ICONS.Alert size={24}/>} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2" title="Revenue vs Expenses">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchase" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activities">
          <div className="space-y-6">
            {[...salesOrders, ...purchaseOrders]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map(order => (
                <div key={order.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${order.id.startsWith('SO') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {order.id.startsWith('SO') ? <ICONS.Sales size={16}/> : <ICONS.Purchase size={16}/>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{order.id}</p>
                    <p className="text-xs text-slate-500">{(order as any).customerName || (order as any).vendorName}</p>
                  </div>
                  <Badge color={order.id.startsWith('SO') ? 'emerald' : 'blue'}>
                    ${order.totalAmount}
                  </Badge>
                </div>
            ))}
            {(salesOrders.length === 0 && purchaseOrders.length === 0) && <p className="text-slate-400 text-center py-10">No activities yet.</p>}
          </div>
        </Card>
      </div>
      
      {/* 
        EXTENSIBILITY NOTE:
        Add Manufacturing Module components here to show work orders and production schedules.
        Add HR & Payroll dashboard summary for employee attendance and salary payouts.
      */}
    </div>
  );
};
