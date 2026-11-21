'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface TableQrManagerProps {
  orders: any[];
}

interface TableItem {
  id: string;
  name: string;
  seats: number;
}

export default function TableQrManager({ orders }: TableQrManagerProps) {
  const [tables, setTables] = useState<TableItem[]>([
    { id: '1', name: 'Table 1', seats: 4 },
    { id: '2', name: 'Table 2', seats: 2 },
    { id: '3', name: 'Table 3', seats: 4 },
    { id: '4', name: 'Table 4', seats: 6 },
    { id: '5', name: 'Table 5', seats: 4 },
    { id: '6', name: 'Table 6', seats: 2 },
    { id: '7', name: 'Table 7', seats: 4 },
    { id: '8', name: 'Table 8', seats: 8 },
    { id: '9', name: 'Table 9', seats: 4 },
    { id: '10', name: 'Table 10', seats: 4 },
    { id: '11', name: 'Table 11', seats: 6 },
    { id: '12', name: 'Table 12', seats: 4 },
  ]);

  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});
  const [newTableName, setNewTableName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('http://localhost:3000');

  // Printable Standee Modal State
  const [selectedTableForPrint, setSelectedTableForPrint] = useState<TableItem | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Generate QR Code data URLs whenever tables or origin change
  useEffect(() => {
    tables.forEach(async (table) => {
      try {
        const tableUrl = `${origin}/table/${encodeURIComponent(table.name.replace(/\s+/g, '-'))}`;
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
    const tableUrl = `${origin}/table/${encodeURIComponent(table.name.replace(/\s+/g, '-'))}`;
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

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    const nextId = String(Date.now());
    setTables((prev) => [
      ...prev,
      { id: nextId, name: newTableName.trim(), seats: 4 },
    ]);
    setNewTableName('');
  };

  const handleRemoveTable = (id: string) => {
    if (confirm('Are you sure you want to remove this table?')) {
      setTables((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-[#B45309] flex items-center justify-center font-bold">
              <QrCode size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Table QR Code &amp; Standee Manager
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Dynamic QR codes for every table in Raghav Rasoi. Customers scan with their phone camera to view menu, place orders, and pay online.
          </p>
        </div>

        {/* Add Table Form */}
        <form onSubmit={handleAddTable} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="e.g. Table 13 or VIP 1"
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#B45309]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-extrabold text-xs transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus size={14} /> Add Table
          </button>
        </form>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tables.map((table) => {
          const qrUrl = qrCodeDataUrls[table.id];
          const tableUrl = `${origin}/table/${encodeURIComponent(table.name.replace(/\s+/g, '-'))}`;

          // Check if table currently has active dining orders
          const activeOrders = orders.filter(
            (o) =>
              (o.tableNo?.toLowerCase() === table.name.toLowerCase() ||
                o.tableNo?.toLowerCase() === `table ${table.name.toLowerCase()}`) &&
              (o.status === 'PENDING' || o.status === 'PREPARING')
          );
          const isOccupied = activeOrders.length > 0;

          return (
            <div
              key={table.id}
              className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isOccupied ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Table Header & Occupancy Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">
                      {table.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold">{table.seats} Seats</p>
                  </div>

                  {isOccupied ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] animate-pulse">
                      <Clock size={11} /> {activeOrders.length} Active Order
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                      <CheckCircle2 size={11} /> Available
                    </span>
                  )}
                </div>

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
                    <span>Test Menu</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

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
                  <p>Helpline: +91 88396-75538 • Greater Noida West</p>
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
