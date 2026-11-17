'use client';

import React, { useState } from 'react';
import { UserPlus, X, Check, CheckSquare } from 'lucide-react';
import { useAdminAuth, ALL_PERMISSIONS } from '@/context/AdminAuthContext';

interface StaffRbacManagerProps {
  onRefresh: () => Promise<void>;
}

export default function StaffRbacManager({ onRefresh }: StaffRbacManagerProps) {
  const { allStaff, currentStaff, switchStaffAccount } = useAdminAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('staff@123');
  const [permissions, setPermissions] = useState<string[]>(['kanban', 'print_kot', 'toggle_stock']);
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setName('');
    setRoleTitle('Counter & Kitchen Staff');
    setLogin('');
    setPassword('staff@123');
    setPermissions(['kanban', 'print_kot', 'toggle_stock']);
    setModalOpen(true);
  };

  const handleOpenEdit = (st: any) => {
    setEditingStaff(st);
    setName(st.name);
    setRoleTitle(st.roleTitle);
    setLogin(st.login);
    setPassword(st.password || 'staff@123');
    setPermissions(st.permissions || []);
    setModalOpen(true);
  };

  const handleTogglePerm = (key: string) => {
    if (permissions.includes(key)) {
      setPermissions(permissions.filter((p) => p !== key));
    } else {
      setPermissions([...permissions, key]);
    }
  };

  const handleSelectAll = () => {
    setPermissions(ALL_PERMISSIONS.map((p) => p.key));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !login.trim() || !permissions.length) {
      alert('Please fill in required fields and select at least 1 permission.');
      return;
    }

    setSaving(true);
    try {
      if (editingStaff) {
        await fetch('/api/admin/staff', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingStaff.id,
            name: name.trim(),
            roleTitle: roleTitle.trim(),
            login: login.trim(),
            password: password.trim(),
            permissions,
          }),
        });
      } else {
        await fetch('/api/admin/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            roleTitle: roleTitle.trim(),
            login: login.trim(),
            password: password.trim(),
            permissions,
          }),
        });
      }
      setModalOpen(false);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Custom Staff &amp; Checkbox Role Permissions
          </h2>
          <p className="text-xs text-slate-500">
            Create staff logins and tick exact module permissions. Test any staff account from the top bar!
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold text-xs shadow-xs transition-colors"
        >
          <UserPlus size={15} />
          <span>Create Staff &amp; Assign Permissions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allStaff.map((st) => (
          <div
            key={st.id}
            className={`bg-white rounded-2xl p-4 border transition-all ${
              st.id === currentStaff?.id
                ? 'border-[#E5203A] ring-2 ring-[#E5203A]/15'
                : 'border-slate-200'
            } shadow-2xs flex flex-col justify-between gap-3`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{st.name}</h4>
                  <p className="text-[11px] font-semibold text-[#0F766E]">
                    {st.roleTitle} • <span className="font-mono text-slate-400">{st.login}</span>
                  </p>
                </div>
                {st.id === currentStaff?.id && (
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-[#E5203A] font-extrabold text-[10px]">
                    Current
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {ALL_PERMISSIONS.map((p) => {
                  const granted = st.permissions.includes(p.key);
                  return (
                    <span
                      key={p.key}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        granted
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      }`}
                    >
                      {granted ? '✓' : '✕'} {p.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => switchStaffAccount(st.id)}
                className="font-extrabold text-[#0F766E] hover:underline"
              >
                Test This Login →
              </button>

              {!st.isOwner ? (
                <button
                  onClick={() => handleOpenEdit(st)}
                  className="px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit Perms
                </button>
              ) : (
                <span className="text-[10px] font-bold text-slate-400">Master Account</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">
                {editingStaff ? 'Edit Staff & Permissions' : 'Create Staff & Assign Permissions'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amit Verma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Label *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Shift Supervisor"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / Email Login *</label>
                  <input
                    type="text"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="amit@spicegrill.in"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-[#E5203A]"
                  />
                </div>
              </div>

              {/* 8 Granular Checkbox Permissions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Tick Allowed Permissions:
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] font-bold text-[#0F766E] hover:underline"
                  >
                    Select All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {ALL_PERMISSIONS.map((p) => {
                    const isChecked = permissions.includes(p.key);
                    return (
                      <label
                        key={p.key}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-[#0F766E] text-xs font-bold text-slate-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePerm(p.key)}
                          className="w-4 h-4 accent-[#0F766E]"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#E5203A] hover:bg-[#C8172E] text-white font-extrabold transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
