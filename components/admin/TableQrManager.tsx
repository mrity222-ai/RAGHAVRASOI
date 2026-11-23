'use client';

import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';
import {
  QrCode,
  Printer,
  Download,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Ban,
  Armchair,
} from 'lucide-react';

interface TableQrManagerProps {
  orders: any[];
}

interface TableItem {
  id: string;
  tableNo: string;
  name: string;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DISABLED';
  activeOrder?: string | null;
  activeOrderDetails?: any;
}

export default function TableQrManager({ orders }: TableQrManagerProps) {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('http://localhost:3000');

  // Printable Standee Modal State
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<TableItem | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const loadTables = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/admin/tables');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTables(data.data);
      } else {
        setError(data.error || 'Failed to load tables');
      }
    } catch (err) {
      console.error(err);
      setError('Network error while loading tables.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // Generate QR Code data URLs whenever tables or origin change
  useEffect(() => {
    tables.forEach(async (table) => {
      try {
        const tableSlug = table.tableNo || table.name.replace(/\s+/g, '-');
        const tableUrl = `${origin}/table/${encodeURIComponent(tableSlug)}`;
        const dataUrl = await QRCode.toDataURL(tableUrl, {
          width: 380,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrCodeDataUrls((prev) => ({ ...prev, [table.id]: dataUrl }));
      } catch (err) {
        console.error('Error generating QR for table', table.name, err);
      }
    });
  }, [tables, origin]);

  const handleCopyLink = (table: TableItem) => {
    const tableSlug = table.tableNo || table.name.replace(/\s+/g, '-');
    const tableUrl = `${origin}/table/${encodeURIComponent(tableSlug)}`;
    navigator.clipboard.writeText(tableUrl);
    setCopiedId(table.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadQr = (table: TableItem) => {
    const dataUrl = qrCodeDataUrls[table.id];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Raghav-Rasoi-${table.name.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    try {
      setActionLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawName: newTableName.trim(), seats: newTableSeats }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || `Table added successfully!`);
        setNewTableName('');
        await loadTables();
      } else {
        setError(data.error || 'Failed to add table');
      }
    } catch (err) {
      console.error(err);
      setError('Error adding table.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteTable = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete '${name}'?\nCustomers scanning this QR will no longer be able to order.`)) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      const res = await fetch(`/api/admin/tables?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || `Table '${name}' deleted successfully.`);
        await loadTables();
      } else {
        setError(data.error || 'Failed to delete table');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting table.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleFreeTable = async (id: string, name: string) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/admin/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'AVAILABLE' }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`${name} is now Available!`);
        await loadTables();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-amber-100 text-[#B45309] flex items-center justify-center font-bold shadow-xs">
              <QrCode size={20} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Table QR Code &amp; Availability Manager
            </h2>
            <button
              onClick={loadTables}
              disabled={loading}
              title="Refresh tables"
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-2xl">
            Live dining tables with automatic availability. Add new tables or delete existing tables. Tables automatically become <strong>Occupied</strong> on order, and <strong>Available</strong> when completed.
          </p>
        </div>

        {/* Add Table Form */}
        <form onSubmit={handleAddTable} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            required
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="e.g. Table 13 or VIP 1"
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#B45309] w-full sm:w-44"
          />
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-300">
            <Armchair size={14} className="text-slate-400" />
            <select
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value={2}>2 Seats</option>
              <option value={4}>4 Seats</option>
              <option value={6}>6 Seats</option>
              <option value={8}>8 Seats</option>
              <option value={10}>10 Seats</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50"
          >
            <Plus size={15} /> Add Table
          </button>
        </form>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}><X size={14} /></button>
        </div>
      )}

      {/* Tables Grid */}
      {loading && tables.length === 0 ? (
        <div className="p-12 text-center text-slate-400 font-bold text-sm bg-white rounded-3xl border border-slate-200">
          Loading tables...
        </div>
      ) : tables.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200 space-y-2">
          <p className="font-black text-base text-slate-700">No tables found</p>
          <p className="text-xs">Add your first table using the form above to start generating QR codes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tables.map((table) => {
            const qrUrl = qrCodeDataUrls[table.id];
            const tableSlug = table.tableNo || table.name.replace(/\s+/g, '-');
            const tableUrl = `${origin}/table/${encodeURIComponent(tableSlug)}`;

            const isOccupied = table.status === 'OCCUPIED';

            return (
              <div
                key={table.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isOccupied
                    ? 'border-amber-400 ring-2 ring-amber-400/25 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Table Header, Seats & Status */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-tight">
                        {table.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400 font-bold">{table.seats} Seats</span>
                        <span className="text-[10px] text-slate-300 font-mono">({table.tableNo})</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isOccupied ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] animate-pulse">
                          <Clock size={11} /> Occupied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                          <CheckCircle2 size={11} /> Available
                        </span>
                      )}

                      {/* Delete Table Action */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTable(table.id, table.name)}
                        disabled={actionLoading}
                        title={`Delete ${table.name}`}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Active Order Notice if Occupied */}
                  {isOccupied && table.activeOrder && (
                    <div className="mt-3 p-2.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 flex items-center justify-between">
                      <div>
                        <p className="font-black text-[11px]">Active: #{table.activeOrder}</p>
                        {table.activeOrderDetails && (
                          <p className="text-[10px] text-amber-800">
                            ₹{table.activeOrderDetails.grandTotal} • {table.activeOrderDetails.customerName || 'Diner'}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFreeTable(table.id, table.name)}
                        className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] shadow-2xs transition-colors"
                        title="Free table after customer leaves"
                      >
                        Free Table
                      </button>
                    </div>
                  )}

                  {/* QR Code Display */}
                  <div className="my-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    {qrUrl ? (
                      <div className="relative w-44 h-44 bg-white rounded-xl p-2 shadow-xs border border-slate-200">
                        <Image
                          src={qrUrl}
                          alt={`QR code for ${table.name}`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="w-44 h-44 bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400 font-bold">
                        Generating QR...
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 font-mono mt-2 truncate max-w-full">
                      {tableUrl}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTableForPrint(table)}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#B45309] text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Printer size={13} />
                      <span>Print Standee</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadQr(table)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(table)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-black transition-colors"
                    >
                      {copiedId === table.id ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={tableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B45309] hover:underline"
                    >
                      <span>Open Menu</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ================= Printable Table Standee Modal ================= */}
      {selectedTableForPrint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full print:h-full print:rounded-none">
            
            {/* Modal Top Control Bar (Hidden on Print) */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
                <Printer size={15} className="text-amber-400" />
                Table Standee Preview
              </span>
              <button
                onClick={() => setSelectedTableForPrint(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Standee Content Sheet (Printed Directly) */}
            <div className="p-7 text-center space-y-4 print:p-10 flex-1 flex flex-col items-center justify-center bg-[#FAF8F5]">
              
              {/* Standee Card Frame */}
              <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-500/30 shadow-xl space-y-4 print:border-amber-600 print:shadow-none">
                
                {/* Restaurant Brand Header */}
                <div className="space-y-1">
                  <div className="relative w-16 h-16 mx-auto mb-1">
                    <Image
                      src="/assets/logo/raghav-rasoi-logo-transparent.png"
                      alt="Raghav Rasoi"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h1 className="text-2xl font-black font-serif text-slate-900 tracking-tight leading-tight">
                    राघव रसोई
                  </h1>
                  <p className="text-[10px] uppercase font-black tracking-widest text-[#B45309]">
                    RAGHAV RASOI • PURE VEGETARIAN
                  </p>
                </div>

                {/* Table Number Pill */}
                <div className="inline-block px-6 py-2 rounded-full bg-amber-400 text-slate-950 font-black text-lg tracking-wider shadow-xs border-2 border-amber-500">
                  {selectedTableForPrint.name.toUpperCase()}
                </div>

                {/* Centered QR Code with Frame */}
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 inline-block shadow-inner">
                  {qrCodeDataUrls[selectedTableForPrint.id] && (
                    <div className="relative w-52 h-52 mx-auto">
                      <Image
                        src={qrCodeDataUrls[selectedTableForPrint.id]}
                        alt={`QR code for ${selectedTableForPrint.name}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </div>

                {/* 3 Step Instruction Guide */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Scan with Phone Camera to Order
                  </p>
                  <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                    <p>1. Open Camera / Google Lens / GPay / Paytm</p>
                    <p>2. Select Dishes &amp; Add to Cart</p>
                    <p>3. Pay Online or Cash at Table</p>
                  </div>
                </div>

                {/* Standee Footer Note */}
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  <p className="font-bold">Fresh Food • Served Hot at Your Table</p>
                  <p>Helpline: +91 88396-75538 • Gundardehi, Chhattisgarh 491223</p>
                </div>

              </div>

            </div>

            {/* Modal Bottom Actions (Hidden on Print) */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
              <button
                type="button"
                onClick={() => setSelectedTableForPrint(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-extrabold text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Printer size={15} />
                <span>Print Standee Card</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
