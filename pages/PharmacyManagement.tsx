
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
  
  // Modal Visibility
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  // Editing States
  const [editingItem, setEditingItem] = useState<PharmacyItem | null>(null);
  const [editingSale, setEditingSale] = useState<PharmacySale | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<PharmacySupplier | null>(null);

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

  // --- Handlers ---
  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      stock: parseInt(formData.get('stock') as string),
      minStockLevel: parseInt(formData.get('minStockLevel') as string),
      price: parseFloat(formData.get('price') as string),
      expiryDate: formData.get('expiryDate') as string,
      supplierId: formData.get('supplierId') as string,
    };

    if (editingItem) {
      await apiService.updatePharmacyItem(editingItem.id, data);
    } else {
      await apiService.createPharmacyItem(data);
    }
    setEditingItem(null);
    setShowAddMedModal(false);
    loadData();
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Permanently remove this medicine from inventory?")) {
      await apiService.deletePharmacyItem(id);
      loadData();
    }
  };

  const handleSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      patientName: formData.get('patientName') as string,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
      paymentStatus: formData.get('paymentStatus') as any,
      items: editingSale?.items || [] // Simple implementation
    };

    if (editingSale) {
      await apiService.updatePharmacySale(editingSale.id, data);
    } else {
      await apiService.createPharmacySale(data);
    }
    setEditingSale(null);
    setShowAddSaleModal(false);
    loadData();
  };

  const handleDeleteSale = async (id: string) => {
    if (confirm("Delete this billing record?")) {
      await apiService.deletePharmacySale(id);
      loadData();
    }
  };

  const handleSupplierSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
    };

    if (editingSupplier) {
      await apiService.updatePharmacySupplier(editingSupplier.id, data);
    } else {
      await apiService.createPharmacySupplier(data);
    }
    setEditingSupplier(null);
    setShowAddSupplierModal(false);
    loadData();
  };

  const handleDeleteSupplier = async (id: string) => {
    if (confirm("Remove this supplier from records?")) {
      await apiService.deletePharmacySupplier(id);
      loadData();
    }
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
            <button onClick={() => { setEditingItem(null); setShowAddMedModal(true); }} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center">
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
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Expiry</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {inventory.map(item => {
                     const stockAlert = getStockAlert(item);
                     const expiryAlert = getExpiryAlert(item.expiryDate);
                     return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
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
                           <td className="px-6 py-4 text-center text-xs font-medium text-slate-500">
                              {item.expiryDate}
                              {expiryAlert && <span className={`block px-2 py-0.5 mt-1 rounded text-[8px] font-black uppercase ${expiryAlert.color}`}>{expiryAlert.label}</span>}
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                 <button onClick={() => { setEditingItem(item); setShowAddMedModal(true); }} className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors">
                                    <Icons.Cog6Tooth className="w-4 h-4" />
                                 </button>
                                 <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                                    <Icons.Logout className="w-4 h-4" />
                                 </button>
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
              <button onClick={() => { setEditingSale(null); setShowAddSaleModal(true); }} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                New Billing
              </button>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {sales.map(sale => (
                 <div key={sale.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 transition-all group">
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
                       <div className="flex gap-2">
                          <button onClick={() => { setEditingSale(sale); setShowAddSaleModal(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100">
                             <Icons.Cog6Tooth className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteSale(sale.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                             <Icons.Logout className="w-5 h-5" />
                          </button>
                       </div>
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
              <button onClick={() => { setEditingSupplier(null); setShowAddSupplierModal(true); }} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                Add Supplier
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map(sup => (
                 <div key={sup.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-all">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-3xl -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start mb-1 pr-4">
                       <h3 className="font-bold text-slate-800 text-lg">{sup.name}</h3>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => { setEditingSupplier(sup); setShowAddSupplierModal(true); }} className="text-slate-400 hover:text-emerald-600"><Icons.Cog6Tooth className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteSupplier(sup.id)} className="text-slate-400 hover:text-red-600"><Icons.Logout className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold mb-4">Lead Contact: {sup.contactPerson}</p>
                    <div className="space-y-2 pt-4 border-t border-slate-50">
                       <div className="flex items-center text-[10px] text-slate-500">
                          <Icons.Phone className="w-3 h-3 mr-2 text-emerald-500" />
                          {sup.phone}
                       </div>
                       <div className="flex items-center text-[10px] text-slate-500">
                          <Icons.Mail className="w-3 h-3 mr-2 text-emerald-500" />
                          {sup.email}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Add/Edit Medicine Modal */}
      {showAddMedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-800">{editingItem ? 'Edit Medicine' : 'Inventory Entry'}</h3>
                <button onClick={() => setShowAddMedModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleItemSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Medicine Name</label>
                  <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Ibuprofen" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                    <select name="category" defaultValue={editingItem?.category} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                       <option>Tablet</option>
                       <option>Capsule</option>
                       <option>Syrup</option>
                       <option>Injection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Unit Price ($)</label>
                    <input name="price" type="number" step="0.01" defaultValue={editingItem?.price} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Stock</label>
                    <input name="stock" type="number" defaultValue={editingItem?.stock} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Min Stock Level</label>
                    <input name="minStockLevel" type="number" defaultValue={editingItem?.minStockLevel} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expiry Date</label>
                   <input name="expiryDate" type="date" defaultValue={editingItem?.expiryDate} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all mt-4 uppercase tracking-widest text-xs">
                  {editingItem ? 'Update Stock' : 'Save to Inventory'}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Add/Edit Sale Modal */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-800">{editingSale ? 'Edit Billing' : 'Retail Sales Entry'}</h3>
                <button onClick={() => setShowAddSaleModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSaleSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Name</label>
                  <input name="patientName" defaultValue={editingSale?.patientName} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Amount ($)</label>
                    <input name="totalAmount" type="number" step="0.01" defaultValue={editingSale?.totalAmount} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                    <select name="paymentStatus" defaultValue={editingSale?.paymentStatus} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none">
                       <option>Paid</option>
                       <option>Pending</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all mt-4 uppercase tracking-widest text-xs">
                  {editingSale ? 'Update Invoice' : 'Finalize Billing'}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Add/Edit Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-800">{editingSupplier ? 'Edit Vendor' : 'New Supplier'}</h3>
                <button onClick={() => setShowAddSupplierModal(false)} className="text-emerald-400 hover:text-emerald-600 font-bold text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSupplierSubmit} className="p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
                  <input name="name" defaultValue={editingSupplier?.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Person</label>
                  <input name="contactPerson" defaultValue={editingSupplier?.contactPerson} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                    <input name="phone" defaultValue={editingSupplier?.phone} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                    <input name="email" type="email" defaultValue={editingSupplier?.email} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                  <textarea name="address" defaultValue={editingSupplier?.address} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all mt-4 uppercase tracking-widest text-xs">
                  {editingSupplier ? 'Update Vendor' : 'Onboard Supplier'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyManagement;
