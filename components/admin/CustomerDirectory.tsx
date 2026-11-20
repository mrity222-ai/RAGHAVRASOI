'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  Eye,
  X,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Receipt,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  size: string;
  unitPrice: number;
  lineTotal: number;
}

interface CustomerOrder {
  id: string;
  status: string;
  orderType: string;
  tableNo: string | null;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  itemsCount: number;
  items: OrderItem[];
}

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  totalOrders: number;
  lifetimeSpend: number;
  lastOrderDate: string | null;
  orders: CustomerOrder[];
}

export default function CustomerDirectory() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'orders' | 'spend'>('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.data) {
        setCustomers(data.data);
      }
    } catch (e) {
      console.error('Error fetching customers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter and sort
  const filteredCustomers = customers
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'spend') return b.lifetimeSpend - a.lifetimeSpend;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate Metrics
  const totalRegistered = customers.length;
  const totalCustomerOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalCustomerSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);
  const avgOrderValue = totalCustomerOrders > 0 ? Math.round(totalCustomerSpend / totalCustomerOrders) : 0;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-[#B45309]" />
            <span>Registered Customers Directory (पंजीकृत ग्राहक)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            सभी पंजीकृत ग्राहकों का विवरण, ऑर्डर इतिहास और कुल खर्च (Lifetime Spend)
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
        >
          🔄 Refresh Users
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Customers</p>
          <div className="flex items-center justify-between mt-1.5">
            <h3 className="text-2xl font-black text-slate-900">{totalRegistered}</h3>
            <span className="p-2 bg-amber-50 text-[#B45309] rounded-xl">
              <Users size={18} />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Customer Orders</p>
          <div className="flex items-center justify-between mt-1.5">
            <h3 className="text-2xl font-black text-slate-900">{totalCustomerOrders}</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag size={18} />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Customer Revenue</p>
          <div className="flex items-center justify-between mt-1.5">
            <h3 className="text-2xl font-black text-emerald-700">₹{totalCustomerSpend.toLocaleString('en-IN')}</h3>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <IndianRupee size={18} />
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Order Value</p>
          <div className="flex items-center justify-between mt-1.5">
            <h3 className="text-2xl font-black text-slate-900">₹{avgOrderValue.toLocaleString('en-IN')}</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp size={18} />
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#FBBF24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-bold shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white focus:outline-none focus:border-[#FBBF24]"
          >
            <option value="recent">Recently Registered (नवीनतम)</option>
            <option value="orders">Most Orders Placed (सर्वाधिक ऑर्डर)</option>
            <option value="spend">Highest Total Spend (उच्चतम खर्च)</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            लोड हो रहा है... (Loading registered users...)
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users size={24} />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">कोई ग्राहक नहीं मिला</h4>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'सर्च क्वेरी से मेल खाता कोई ग्राहक नहीं है।' : 'अभी तक कोई ग्राहक पंजीकृत नहीं हुआ है।'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Customer Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{cust.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {cust.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono font-semibold">
                          <Phone size={12} className="text-slate-400" />
                          <span>+91 {cust.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail size={12} className="text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatDate(cust.createdAt)}</span>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs ${
                        cust.totalOrders > 0
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-slate-900 font-mono text-sm">
                        ₹{cust.lifetimeSpend.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Action: View History Modal */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={13} />
                        <span>View Orders ({cust.orders.length})</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{selectedCustomer.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">+91 {selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>{selectedCustomer.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Customer Stats */}
            <div className="px-5 sm:px-6 py-3 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Orders: </span>
                  <span className="font-black text-slate-900">{selectedCustomer.totalOrders}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Lifetime Spend: </span>
                  <span className="font-black text-emerald-700">₹{selectedCustomer.lifetimeSpend.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Member since {formatDate(selectedCustomer.createdAt)}
              </div>
            </div>

            {/* Orders List Container */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">
                All Orders History ({selectedCustomer.orders.length})
              </h4>

              {selectedCustomer.orders.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-bold">इस ग्राहक ने अभी तक कोई ऑर्डर नहीं दिया है।</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    जब यह ग्राहक ऑर्डर करेगा, यहाँ सभी विवरण दिखेंगे।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCustomer.orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 transition-colors space-y-3"
                    >
                      {/* Order Title Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black font-mono text-sm text-slate-900">{order.id}</span>
                          {order.tableNo && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                              🍽️ {order.tableNo}
                            </span>
                          )}
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold uppercase">
                            {order.orderType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'READY'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'PREPARING'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-xs font-mono font-black text-emerald-700">
                            ₹{order.grandTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="space-y-1.5 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-slate-700">
                            <span>
                              <span className="font-bold text-slate-900">{item.qty}x</span> {item.name}
                              {item.size && item.size !== 'Regular' && (
                                <span className="text-[10px] text-slate-500 ml-1 font-mono">({item.size})</span>
                              )}
                            </span>
                            <span className="font-mono text-slate-600 font-semibold">
                              ₹{item.lineTotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer date & payment */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <span className="font-bold text-slate-600">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                बंद करें (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
