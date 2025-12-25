
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { PharmacyItem, PharmacySale, PharmacySupplier } from '../types';
import { Icons } from '../constants';

const PharmacyManagement: React.FC = () => {
  const [inventory, setInventory] = useState<PharmacyItem[]>([]);
  const [sales, setSales] = useState<PharmacySale[]>([]);
  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'suppliers'>('inventory');
  
  // Modals
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [inv, s, sup] = await Promise.all([
      apiService.getPharmacyInventory(),
      apiService.getPharmacySales(),
      apiService.getPharmacySuppliers()
    ]);
    setInventory(inv);
    setSales(s);
    setSuppliers(sup);
    setLoading(false);
  };

  const getStockAlert = (item: PharmacyItem) => {
    if (item.stock <= 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (item.stock <= item.minStockLevel) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    return null;
  };

  const getExpiryAlert = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { label: 'Expired', color: 'text-red-700 bg-red-100' };
    if (diffDays <= 30) return { label: 'Expiring Soon', color: 'text-amber-700 bg-amber-100' };
    return null;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Icons.Pharmacy className="w-8 h-8 mr-3 text-emerald-600" />
            Pharmacy Management
          </h1>
          <p className="text-sm text-slate-500">Track drug inventory, handle retail billing, and manage pharmaceutical vendors.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Inventory</button>
          <button onClick={() => setActiveTab('sales')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'sales' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Sales & Billing</button>
          <button onClick={() => setActiveTab('suppliers')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'suppliers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Suppliers</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-700">Medicine Directory</h2>
            <button onClick={() => setShowAddMedModal(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center">
              Add New Medicine
            </button>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">In Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Unit Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Expiry Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Alerts</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {inventory.map(item => {
                     const stockAlert = getStockAlert(item);
                     const expiryAlert = getExpiryAlert(item.expiryDate);
                     return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-[10px] text-slate-400">ID: {item.id}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{item.category}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <p className={`font-black ${item.stock <= item.minStockLevel ? 'text-red-600' : 'text-slate-800'}`}>{item.stock}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Min: {item.minStockLevel}</p>
                           </td>
                           <td className="px-6 py-4 text-center font-bold text-emerald-600">${item.price}</td>
                           <td className="px-6 py-4 text-center text-xs font-medium text-slate-500">{item.expiryDate}</td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col items-center gap-1">
                                 {stockAlert && <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${stockAlert.color}`}>{stockAlert.label}</span>}
                                 {expiryAlert && <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${expiryAlert.color}`}>{expiryAlert.label}</span>}
                                 {!stockAlert && !expiryAlert && <span className="text-[10px] text-green-500 font-bold">Safe</span>}
                              </div>
                           </td>
                        </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Recent Transactions</h2>
              <button onClick={() => setShowAddSaleModal(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                New Billing
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {sales.map(sale => (
                 <div key={sale.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-400">#{sale.id}</span>
                          <h3 className="font-bold text-slate-800">{sale.patientName}</h3>
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{sale.date}</p>
                       <div className="flex flex-wrap gap-1 mt-2">
                          {sale.items.map((it, i) => (
                             <span key={i} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-bold">
                                {it.itemName} x{it.quantity}
                             </span>
                          ))}
                       </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                       <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Bill</p>
                          <p className="text-xl font-black text-slate-800">${sale.totalAmount.toFixed(2)}</p>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${sale.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {sale.paymentStatus}
                       </span>
                       <button className="p-2 text-slate-400 hover:text-emerald-600"><Icons.Prescription className="w-5 h-5" /></button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-700">Vendor Management</h2>
              <button onClick={() => setShowAddSupplierModal(true)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                Add Supplier
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(sup => (
                 <div key={sup.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-3xl -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{sup.name}</h3>
                    <p className="text-xs text-emerald-600 font-bold mb-4">Lead Contact: {sup.contactPerson}</p>
                    <div className="space-y-2 pt-4 border-t border-slate-50">
                       <div className="flex items-center text-[10px] text-slate-500">
                          <svg className="w-3 h-3 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth={2}/></svg>
                          {sup.phone}
                       </div>
                       <div className="flex items-center text-[10px] text-slate-500">
                          <svg className="w-3 h-3 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>
                          {sup.email}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-800">Inventory Entry</h3>
                <button onClick={() => setShowAddMedModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); setShowAddMedModal(false); loadData(); }} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medicine Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Ibuprofen" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                       <option>Tablet</option>
                       <option>Capsule</option>
                       <option>Syrup</option>
                       <option>Injection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unit Price ($)</label>
                    <input type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Stock</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                    <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all mt-4">Save to Inventory</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyManagement;
