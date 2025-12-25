
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Invoice, BillingCategory, Patient } from '../types';
import { Icons } from '../constants';

const BillingManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BillingCategory | 'ALL'>(BillingCategory.OPD);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [inv, pts] = await Promise.all([
      apiService.getInvoices(),
      apiService.getPatients()
    ]);
    setInvoices(inv);
    setPatients(pts);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: Invoice['status']) => {
    await apiService.updateInvoice(id, { status });
    loadData();
  };

  const handleInsuranceAction = async (id: string, status: Invoice['insuranceStatus']) => {
    await apiService.updateInvoice(id, { insuranceStatus: status, status: status === 'Approved' ? 'Paid' : 'Unpaid' });
    loadData();
  };

  const filteredInvoices = activeTab === 'ALL' ? invoices : invoices.filter(inv => inv.category === activeTab);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Currency className="w-8 h-8 mr-3 text-sky-600" />
            Billing & Accounts
          </h1>
          <p className="text-sm text-slate-500">Manage OPD/IPD invoicing, diagnostic billing, and insurance claims.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap">
          {Object.values(BillingCategory).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === cat ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
            >
              {cat}
            </button>
          ))}
          <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'ALL' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
            >
              All Invoices
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Unpaid Balance</p>
           <p className="text-2xl font-black text-red-600">${invoices.filter(i => i.status === 'Unpaid').reduce((a,c)=>a+c.total, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Paid Today</p>
           <p className="text-2xl font-black text-green-600">${invoices.filter(i => i.status === 'Paid').reduce((a,c)=>a+c.total, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Insurance Claims</p>
           <p className="text-2xl font-black text-amber-600">{invoices.filter(i => i.insuranceStatus === 'Pending').length} Pending</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center">
           <button 
            onClick={() => setShowInvoiceModal(true)}
            className="w-full bg-sky-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all flex items-center justify-center"
           >
              <Icons.Receipt className="w-5 h-5 mr-2" />
              Create New Bill
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Inv # & Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Payment / Insurance</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800 text-sm">#{inv.id}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{inv.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800">{inv.patientName}</p>
                  <p className="text-[10px] text-slate-400">UID: {inv.patientId}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-tighter">{inv.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="font-black text-slate-800">${inv.total.toLocaleString()}</p>
                  {inv.discount > 0 && <p className="text-[8px] text-red-500 font-bold uppercase">-${inv.discount} Disc.</p>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase w-fit ${
                      inv.status === 'Paid' ? 'bg-green-50 text-green-600' :
                      inv.status === 'Partially Paid' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {inv.status}
                    </span>
                    {inv.paymentMethod === 'Insurance' && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                        inv.insuranceStatus === 'Approved' ? 'border-green-200 text-green-700 bg-green-50' :
                        inv.insuranceStatus === 'Rejected' ? 'border-red-200 text-red-700 bg-red-50' :
                        'border-amber-200 text-amber-700 bg-amber-50'
                      }`}>
                        {inv.insuranceProvider} - {inv.insuranceStatus}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-1">
                    {inv.status === 'Unpaid' && inv.paymentMethod !== 'Insurance' && (
                      <button onClick={() => handleUpdateStatus(inv.id, 'Paid')} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-sky-100 transition-colors">Pay Now</button>
                    )}
                    {inv.paymentMethod === 'Insurance' && inv.insuranceStatus === 'Pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleInsuranceAction(inv.id, 'Approved')} className="bg-green-50 text-green-600 px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-100 transition-colors">Approve</button>
                        <button onClick={() => handleInsuranceAction(inv.id, 'Rejected')} className="bg-red-50 text-red-600 px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors">Reject</button>
                      </div>
                    )}
                    <button className="bg-slate-50 text-slate-400 p-1.5 rounded-lg hover:text-sky-600 transition-colors">
                      <Icons.Prescription className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-400 italic">No transactions found for this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
             <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Generate Inpatient/Outpatient Invoice</h3>
                <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); setShowInvoiceModal(false); loadData(); }} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Patient Select</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                     {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Billing Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       {Object.values(BillingCategory).map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Amount ($)</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Mode</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none">
                       <option>Cash</option>
                       <option>Card</option>
                       <option>Insurance</option>
                       <option>UPI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount Amount</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" defaultValue="0" />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                   <p className="text-sm font-bold text-slate-500">Summary</p>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Total (Inc. 10% Tax)</p>
                      <p className="text-xl font-black text-sky-600">$0.00</p>
                   </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all">Finalize & Print Receipt</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;
