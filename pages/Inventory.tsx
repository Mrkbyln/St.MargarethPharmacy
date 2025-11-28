
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { CATEGORIES } from '../constants';
import { Plus, Search, Trash2, Filter, AlertCircle, Edit, X, Eye, AlertTriangle, Save } from 'lucide-react';
import { Medicine } from '../types';

const Inventory: React.FC = () => {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, currencySymbol } = usePharmacy();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // View Details State
  const [viewMedicine, setViewMedicine] = useState<Medicine | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Confirmation States
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    stock_qty: 0,
    expiry_date: ''
  });

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: CATEGORIES[0],
      price: 0,
      stock_qty: 0,
      expiry_date: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (med: Medicine) => {
    setEditingId(med.id);
    setFormData({
      name: med.name,
      category: med.category,
      price: med.price,
      stock_qty: med.stock_qty,
      expiry_date: med.expiry_date
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMedicine(editingId, formData);
    } else {
      addMedicine(formData);
    }
    setIsModalOpen(false);
    setFormData({
      name: '',
      category: CATEGORIES[0],
      price: 0,
      stock_qty: 0,
      expiry_date: ''
    });
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_qty' ? Number(value) : value
    }));
  };

  // Delete Handlers
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = () => {
    if (deleteId) {
      deleteMedicine(deleteId);
      setDeleteId(null);
      // If the deleted item was being viewed, close the view modal
      if (viewMedicine?.id === deleteId) {
        setViewMedicine(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <h2 className="text-2xl font-extrabold text-slate-800 md:hidden mr-auto">Products & Inventory</h2>
        <button 
          onClick={handleOpenAddModal}
          className={`w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors`}
        >
          <Plus size={20} strokeWidth={3} />
          Add Medicine
        </button>
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden`}>
        {/* Toolbar */}
        <div className="p-2 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all bg-white`}
            />
          </div>
          <button className={`p-2 text-gray-500 hover:bg-white hover:text-[var(--color-text)] hover:shadow-sm rounded-lg border border-gray-200 w-10 h-10 flex items-center justify-center self-end sm:self-auto transition-all bg-white`}>
            <Filter size={20} />
          </button>
        </div>

        {/* Table View (Responsive) */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left">
            <thead className={`bg-[var(--color-light)] text-slate-700 font-bold text-sm uppercase tracking-wider`}>
              <tr>
                <th className="px-2 sm:px-6 py-4 rounded-tl-lg whitespace-nowrap">Medicine Name</th>
                <th className="hidden md:table-cell px-6 py-4 whitespace-nowrap">Category</th>
                <th className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">Price</th>
                <th className="px-2 sm:px-6 py-4 whitespace-nowrap text-center sm:text-left md:hidden lg:table-cell">Stock</th>
                <th className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">Expiry Date</th>
                <th className="px-2 sm:px-6 py-4 text-right rounded-tr-lg whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMedicines.map(med => {
                const isLowStock = med.stock_qty < 10;
                const isExpired = new Date(med.expiry_date) < new Date();
                
                return (
                  <tr key={med.id} className={`hover:bg-[var(--color-light)] transition-colors ${isLowStock ? 'bg-red-50/50' : ''} ${isExpired ? 'bg-red-100/50' : ''}`}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap max-w-[120px] sm:max-w-none">
                      <div className="font-bold text-slate-800 truncate">{med.name}</div>
                      {/* Mobile/Tablet indicators */}
                      <div className="lg:hidden space-y-1 mt-1">
                        {isExpired && <span className="text-[10px] text-red-600 font-black uppercase tracking-wide flex items-center gap-1"><AlertCircle size={10} /> Expired</span>}
                        {isLowStock && !isExpired && <span className="text-[10px] text-orange-600 font-black uppercase tracking-wide flex items-center gap-1"><AlertCircle size={10} /> Low Stock</span>}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-white text-slate-600 border border-slate-200 rounded-full text-xs font-bold whitespace-nowrap shadow-sm">
                        {med.category}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{currencySymbol}{med.price.toFixed(2)}</td>
                    <td className={`px-2 sm:px-6 py-4 font-bold whitespace-nowrap text-center sm:text-left md:hidden lg:table-cell ${isLowStock ? 'text-red-600' : `text-[var(--color-text)]`}`}>
                      {med.stock_qty}
                    </td>
                    <td className={`hidden lg:table-cell px-6 py-4 text-sm font-medium whitespace-nowrap ${isExpired ? 'text-red-600' : 'text-slate-500'}`}>
                      {med.expiry_date}
                    </td>
                    <td className="px-2 sm:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewMedicine(med)}
                          className="text-slate-400 hover:text-[var(--color-text)] transition-colors p-2 hover:bg-[var(--color-light)] rounded-lg lg:hidden"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenEditModal(med)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg hidden lg:block"
                          title="Edit Medicine"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(med.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg hidden lg:block"
                          title="Delete Medicine"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMedicines.length === 0 && (
                 <tr>
                     <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                         No medicines found matching your search.
                     </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal - Rendered via Portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className={`bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center shrink-0`}>
              <h3 className="text-slate-900 font-extrabold text-lg">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-800 hover:bg-white/20 p-1 rounded-full transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white`}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white`}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    name="stock_qty"
                    required
                    value={formData.stock_qty}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    required
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all bg-white`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  {editingId ? <Save size={18} /> : <Plus size={18} />}
                  {editingId ? 'Update Medicine' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* View Details Modal - Rendered via Portal */}
      {viewMedicine && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             <div className="bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center text-slate-900">
                <h3 className="font-extrabold text-lg">Medicine Details</h3>
                <button onClick={() => setViewMedicine(null)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicine Name</label>
                   <p className="text-lg font-bold text-slate-900">{viewMedicine.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <p className="font-semibold text-slate-700 bg-gray-50 px-2 py-1 rounded-md inline-block mt-1">{viewMedicine.category}</p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price</label>
                      <p className="font-bold text-slate-700 text-lg mt-1">{currencySymbol}{viewMedicine.price.toFixed(2)}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Quantity</label>
                      <p className={`font-bold text-lg mt-1 ${viewMedicine.stock_qty < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                         {viewMedicine.stock_qty}
                      </p>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        {viewMedicine.stock_qty === 0 ? <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">Out of Stock</span> :
                         viewMedicine.stock_qty < 10 ? <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Low Stock</span> :
                         <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">In Stock</span>}
                      </div>
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                   <p className={`font-semibold mt-1 ${new Date(viewMedicine.expiry_date) < new Date() ? 'text-red-600' : 'text-slate-700'}`}>
                      {viewMedicine.expiry_date}
                      {new Date(viewMedicine.expiry_date) < new Date() && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Expired</span>}
                   </p>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-2">
                   <button 
                     onClick={() => {
                        setViewMedicine(null);
                        handleOpenEditModal(viewMedicine);
                     }}
                     className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm flex items-center gap-2"
                   >
                     <Edit size={16} /> Edit
                   </button>
                   <button 
                     onClick={() => confirmDelete(viewMedicine.id)}
                     className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-sm flex items-center gap-2"
                   >
                     <Trash2 size={16} /> Delete
                   </button>
                </div>
             </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Delete Modal (Single) - Rendered via Portal */}
      {deleteId && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[110] backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
                <AlertTriangle size={24} />
             </div>
             <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2">Confirm Deletion</h3>
             <p className="text-slate-500 text-center text-sm mb-6 font-medium">
               Are you sure you want to delete this medicine? This action cannot be undone.
             </p>
             <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-slate-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  Delete
                </button>
             </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Inventory;
