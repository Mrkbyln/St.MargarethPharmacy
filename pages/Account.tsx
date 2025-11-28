
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { User, Shield, Plus, Trash2, X, AlertTriangle, Edit, Mail, Lock } from 'lucide-react';
import { User as UserType } from '../types';

const Account: React.FC = () => {
  const { user, registeredUsers, addUser, removeUser, updateUser } = usePharmacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit Profile State (Self)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editError, setEditError] = useState('');
  
  // Staff Management State
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'staff' as 'staff' | 'admin',
    email: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleOpenCreate = () => {
    setEditingUserId(null);
    setFormData({ username: '', password: '', role: 'staff', email: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (targetUser: UserType) => {
    setEditingUserId(targetUser.id);
    setFormData({
      username: targetUser.username,
      password: '', // Leave blank to keep current
      role: targetUser.role,
      email: targetUser.email || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUserId) {
      // Update existing user
      const updates: Partial<UserType> = {
        username: formData.username,
        role: formData.role,
        email: formData.email
      };
      // Only update password if provided
      if (formData.password) {
        updates.password = formData.password;
      }
      updateUser(editingUserId, updates);
      setIsModalOpen(false);
    } else {
      // Create new user
      if (formData.username && formData.password) {
        addUser(formData);
        setIsModalOpen(false);
      }
    }
    setFormData({ username: '', password: '', role: 'staff', email: '' });
    setEditingUserId(null);
  };

  const handleOpenEditProfile = () => {
    if (user) {
      setEditUsername(user.username);
      setEditEmail(user.email || '');
      setEditPassword('');
      setConfirmPassword('');
      setEditError('');
      setIsEditProfileOpen(true);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (editPassword && editPassword !== confirmPassword) {
      setEditError("Passwords do not match");
      return;
    }

    if (user && editUsername.trim()) {
      const updates: Partial<UserType> = {
        username: editUsername,
        email: editEmail
      };
      
      if (editPassword) {
        updates.password = editPassword;
      }

      updateUser(user.id, updates);
      setIsEditProfileOpen(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteUserId(id);
  };

  const executeDelete = () => {
    if (deleteUserId) {
      removeUser(deleteUserId);
      setDeleteUserId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="md:hidden">
        <h2 className="text-2xl font-extrabold text-slate-800">My Account</h2>
        <p className="text-slate-500 font-medium">Profile details and security</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)]"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 uppercase">
                        {user?.username.charAt(0)}
                    </div>
                </div>
                <button 
                  onClick={handleOpenEditProfile}
                  className="bg-white border border-gray-300 text-slate-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-50 shadow-sm flex items-center gap-2"
                >
                    <Edit size={16} /> Edit Profile
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">{user?.username}</h3>
                    <span className="inline-block bg-[var(--color-light)] text-[var(--color-text)] text-xs font-bold px-2 py-0.5 rounded-full mt-1 uppercase tracking-wide">
                        {user?.role}
                    </span>
                    {user?.email && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
                        <Mail size={14} /> {user.email}
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                        <div className="flex items-center gap-3 text-slate-700 font-bold bg-gray-50 p-3 rounded-lg">
                            <User size={18} className="text-slate-400" />
                            {user?.username}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Access</label>
                        <div className="flex items-center gap-3 text-slate-700 font-bold bg-gray-50 p-3 rounded-lg">
                            <Shield size={18} className="text-slate-400" />
                            {user?.role === 'admin' ? 'Administrator' : 'Staff Member'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Staff Management Section (Admin Only) */}
      {isAdmin && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center pt-4 border-t border-gray-200">
             <div>
               <h3 className="text-xl font-extrabold text-slate-800">Staff Management</h3>
               <p className="text-slate-500 font-medium text-sm">Create and manage accounts for your team</p>
             </div>
             <button 
               onClick={handleOpenCreate}
               className="bg-slate-900 text-[var(--color-primary)] font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-md hover:bg-slate-800 transition-colors"
             >
               <Plus size={18} /> Create Account
             </button>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--color-light)] text-slate-700 font-bold text-sm uppercase">
                    <tr>
                      <th className="px-3 sm:px-6 py-4">Username</th>
                      <th className="px-3 sm:px-6 py-4">Role</th>
                      <th className="hidden md:table-cell px-6 py-4">Email</th>
                      <th className="px-3 sm:px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registeredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                               {u.username.charAt(0).toUpperCase()}
                             </div>
                             <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{u.username}</span>
                                <span className="md:hidden text-xs text-slate-400 truncate max-w-[120px]">{u.email}</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'}`}>
                             {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-slate-500 font-medium text-sm">
                          {u.email || '-'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Edit Button for all except self (use Profile Edit for self) */}
                            {u.id !== user?.id && (
                              <button 
                                onClick={() => handleOpenEdit(u)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit User"
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            
                            {/* Delete Button */}
                            {u.id !== user?.id && u.username !== 'admin' && (
                               <button 
                                 onClick={() => confirmDelete(u.id)}
                                 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                 title="Remove User"
                               >
                                 <Trash2 size={18} />
                               </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}

      {/* Add / Edit User Modal - Rendered via Portal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg">{editingUserId ? 'Edit Account' : 'Create New Account'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                   <input 
                     type="text" 
                     required
                     value={formData.username}
                     onChange={(e) => setFormData({...formData, username: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                   <input 
                     type="email" 
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                   <input 
                     type="text" 
                     required={!editingUserId} // Required only when creating new
                     value={formData.password}
                     onChange={(e) => setFormData({...formData, password: e.target.value})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
                     placeholder={editingUserId ? "Leave blank to keep current" : ""}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                   <select 
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'staff'})}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
                   >
                     <option value="staff">Staff</option>
                     <option value="admin">Admin</option>
                   </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-lg font-bold text-sm">Cancel</button>
                   <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-slate-900 rounded-lg font-bold shadow-sm text-sm">
                      {editingUserId ? 'Update User' : 'Create User'}
                   </button>
                </div>
             </form>
           </div>
        </div>,
        document.body
      )}

      {/* Edit Profile Modal (Self) - Rendered via Portal */}
      {isEditProfileOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
             <div className="bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center text-slate-900">
                <h3 className="font-bold text-lg">Edit Profile</h3>
                <button onClick={() => setIsEditProfileOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
             </div>
             <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                {editError && (
                  <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={16} /> {editError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                     <div className="relative">
                       <User size={18} className="absolute left-3 top-2.5 text-slate-400" />
                       <input 
                         type="text" 
                         required
                         value={editUsername}
                         onChange={(e) => setEditUsername(e.target.value)}
                         className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white font-medium"
                       />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                     <div className="relative">
                       <Mail size={18} className="absolute left-3 top-2.5 text-slate-400" />
                       <input 
                         type="email" 
                         value={editEmail}
                         onChange={(e) => setEditEmail(e.target.value)}
                         className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white font-medium"
                         placeholder="Enter email address"
                       />
                     </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <h4 className="text-sm font-bold text-slate-800 mb-3">Change Password (Optional)</h4>
                    <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">New Password</label>
                         <div className="relative">
                           <Lock size={18} className="absolute left-3 top-2.5 text-slate-400" />
                           <input 
                             type="password" 
                             value={editPassword}
                             onChange={(e) => setEditPassword(e.target.value)}
                             className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white font-medium"
                             placeholder="Leave blank to keep current"
                           />
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Confirm Password</label>
                         <div className="relative">
                           <Lock size={18} className="absolute left-3 top-2.5 text-slate-400" />
                           <input 
                             type="password" 
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                             className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white font-medium"
                             placeholder="Re-enter new password"
                           />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                   <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-gray-100 rounded-lg font-bold text-sm">Cancel</button>
                   <button type="submit" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-sm text-sm">Save Changes</button>
                </div>
             </form>
           </div>
        </div>,
        document.body
      )}

      {/* Confirm Delete User Modal - Rendered via Portal */}
      {deleteUserId && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[110] backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
                <AlertTriangle size={24} />
             </div>
             <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2">Delete User?</h3>
             <p className="text-slate-500 text-center text-sm mb-6 font-medium">
               Are you sure you want to delete this account? This action cannot be undone.
             </p>
             <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteUserId(null)}
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

export default Account;
