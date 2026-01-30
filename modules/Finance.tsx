
import React, { useState } from 'react';
import { useERP } from '../context';
import { Card, Badge, StatCard, Button, Modal, Input, Select } from '../components/Shared';
import { ICONS } from '../constants';
import { TransactionType } from '../types';

export const Finance: React.FC = () => {
  const { ledger, salesOrders, purchaseOrders, recordSalesPayment, recordPurchasePayment } = useERP();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'sales' | 'purchase'>('sales');
  const [paymentForm, setPaymentForm] = useState({ refId: '', amount: 0 });

  const totalCredits = ledger.reduce((sum, e) => sum + e.credit, 0);
  const totalDebits = ledger.reduce((sum, e) => sum + e.debit, 0);
  const currentBalance = totalCredits - totalDebits;

  // AR/AP
  const accountsReceivable = salesOrders.reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);
  const accountsPayable = purchaseOrders.reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0);

  const handleRecordPayment = () => {
    if (!paymentForm.refId || paymentForm.amount <= 0) return;
    if (paymentType === 'sales') {
      recordSalesPayment(paymentForm.refId, paymentForm.amount);
    } else {
      recordPurchasePayment(paymentForm.refId, paymentForm.amount);
    }
    setPaymentForm({ refId: '', amount: 0 });
    setPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Financial Ledger</h1>
        <Button colorTheme="purple" onClick={() => setPaymentModalOpen(true)}>
          <ICONS.Finance size={18} className="mr-2"/> Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Net Balance" value={`$${currentBalance.toLocaleString()}`} icon={<ICONS.Finance size={24}/>} color="purple" />
        <StatCard title="Accounts Receivable" value={`$${accountsReceivable.toLocaleString()}`} icon={<ICONS.Success size={24}/>} color="emerald" />
        <StatCard title="Accounts Payable" value={`$${accountsPayable.toLocaleString()}`} icon={<ICONS.Alert size={24}/>} color="blue" />
      </div>

      <Card title="Transaction History">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm border-b">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Description</th>
                <th className="pb-4 font-medium">Reference</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium text-right">Debit (-)</th>
                <th className="pb-4 font-medium text-right">Credit (+)</th>
                <th className="pb-4 font-medium text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ledger.map(entry => (
                <tr key={entry.id}>
                  <td className="py-4 text-slate-500 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-4 text-slate-800 text-sm font-medium">{entry.description}</td>
                  <td className="py-4 text-slate-600 font-mono text-xs">{entry.reference}</td>
                  <td className="py-4">
                    <Badge color={entry.type === TransactionType.SALES || entry.type === TransactionType.PAYMENT_IN ? 'emerald' : 'blue'}>
                      {entry.type}
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-rose-600 font-semibold">{entry.debit > 0 ? `-$${entry.debit}` : '-'}</td>
                  <td className="py-4 text-right text-emerald-600 font-semibold">{entry.credit > 0 ? `+$${entry.credit}` : '-'}</td>
                  <td className="py-4 text-right font-bold text-slate-900">${entry.balance.toLocaleString()}</td>
                </tr>
              ))}
              {ledger.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">No financial records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Record Payment">
        <div className="space-y-4">
          <div className="flex space-x-2 p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setPaymentType('sales')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${paymentType === 'sales' ? 'bg-white shadow text-emerald-600' : 'text-slate-500'}`}
            >
              Sales Receipt
            </button>
            <button 
              onClick={() => setPaymentType('purchase')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${paymentType === 'purchase' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              Vendor Payment
            </button>
          </div>

          <Select 
            label={paymentType === 'sales' ? "Select Sales Order" : "Select Purchase Order"}
            value={paymentForm.refId}
            onChange={e => setPaymentForm({...paymentForm, refId: e.target.value})}
            options={[
              { value: '', label: 'Select reference...' },
              ...(paymentType === 'sales' 
                ? salesOrders.filter(o => o.paidAmount < o.totalAmount).map(o => ({ value: o.id, label: `${o.id} - ${o.customerName} (Due: $${o.totalAmount - o.paidAmount})` }))
                : purchaseOrders.filter(o => o.paidAmount < o.totalAmount).map(o => ({ value: o.id, label: `${o.id} - ${o.vendorName} (Due: $${o.totalAmount - o.paidAmount})` })))
            ]}
          />

          <Input 
            label="Payment Amount ($)" 
            type="number" 
            value={paymentForm.amount} 
            onChange={e => setPaymentForm({...paymentForm, amount: Number(e.target.value)})} 
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
            <Button colorTheme="purple" onClick={handleRecordPayment} disabled={!paymentForm.refId || paymentForm.amount <= 0}>
              Post Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* 
        EXTENSIBILITY NOTE:
        Add Advanced Reporting for Cash Flow forecasting.
        Integration with external accounting software like QuickBooks/Xero.
        Automated bank reconciliation module.
      */}
    </div>
  );
};
