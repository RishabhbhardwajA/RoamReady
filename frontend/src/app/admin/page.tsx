'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  Truck,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient, formatINR } from '@/lib/api';
import { Product, Order, User, Coupon, Review, AdminMetrics } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loginDemoAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'reviews'>('overview');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('tsa-locks');
  const [newPrice, setNewPrice] = useState('699');
  const [newOriginalPrice, setNewOriginalPrice] = useState('1299');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newBadge, setNewBadge] = useState('New Launch');
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // New Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponVal, setCouponVal] = useState('10');
  const [couponMin, setCouponMin] = useState('499');

  // Order status update state
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [metricsRes, prodRes, ordRes, custRes, cpnRes, revRes] = await Promise.all([
        apiClient.get('/admin/metrics').catch(() => null),
        apiClient.get('/admin/products').catch(() => null),
        apiClient.get('/admin/orders').catch(() => null),
        apiClient.get('/admin/customers').catch(() => null),
        apiClient.get('/admin/coupons').catch(() => null),
        apiClient.get('/admin/reviews').catch(() => null),
      ]);

      if (metricsRes?.data?.data?.metrics) setMetrics(metricsRes.data.data.metrics);
      if (prodRes?.data?.data?.products) setProducts(prodRes.data.data.products);
      if (ordRes?.data?.data?.orders) setOrders(ordRes.data.data.orders);
      if (custRes?.data?.data?.customers) setCustomers(custRes.data.data.customers);
      if (cpnRes?.data?.data?.coupons) setCoupons(cpnRes.data.data.coupons);
      if (revRes?.data?.data?.reviews) setReviews(revRes.data.data.reviews);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      const payload = {
        title: newTitle,
        price: Number(newPrice),
        originalPrice: Number(newOriginalPrice),
        discountPercent: Math.round(((Number(newOriginalPrice) - Number(newPrice)) / Number(newOriginalPrice)) * 100),
        stock: Number(newStock),
        categorySlug: newCategory,
        categoryName: newCategory.replace('-', ' ').toUpperCase(),
        shortDescription: newShortDesc || newTitle,
        description: `${newTitle} engineered specifically for frequent travelers and airport transit.`,
        thumbnail: newImage,
        images: [newImage],
        badge: newBadge,
        brand: 'RoamReady',
        specifications: {
          material: 'High-Density Reinforced Alloy / Ripstop Nylon',
          dimensions: 'Standard Travel Dimensions',
          weight: '150 grams',
          warranty: '2-Year Warranty',
          originCountry: 'India'
        },
        variants: [
          {
            id: `var-${Date.now()}`,
            name: 'Standard Edition',
            sku: `RR-${Date.now().toString().slice(-4)}`,
            colorName: 'Midnight Black',
            colorHex: '#0F172A',
            size: 'Standard',
            image: newImage,
            stockCount: Number(newStock),
            inStock: true
          }
        ]
      };

      const res = await apiClient.post('/admin/products', payload);
      if (res.data.success) {
        setProducts([res.data.data.product, ...products]);
        setShowProductModal(false);
        setNewTitle('');
        setNewShortDesc('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product from the catalog?')) {
      try {
        await apiClient.delete(`/admin/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (e) {}
    }
  };

  const handleUpdateStock = async (id: string, delta: number) => {
    const prod = products.find(p => p._id === id);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    try {
      await apiClient.put(`/admin/products/${id}`, { stock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiClient.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by store administrator.`
      });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? res.data.data.order : o));
        setStatusUpdateMessage(`Order status updated to ${newStatus}`);
        setTimeout(() => setStatusUpdateMessage(null), 2500);
      }
    } catch (e) {}
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/coupons', {
        code: couponCode.toUpperCase(),
        description: couponDesc,
        discountType: 'percentage',
        discountValue: Number(couponVal),
        minimumSpend: Number(couponMin),
        maxDiscount: 1000,
        expiresAt: new Date(Date.now() + 90 * 86400000)
      });
      if (res.data.success) {
        setCoupons([...coupons, res.data.data.coupon]);
        setShowCouponModal(false);
        setCouponCode('');
        setCouponDesc('');
      }
    } catch (e) {}
  };

  // If not logged in as Admin, show 1-click test login
  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-slate-900 min-h-screen py-16 flex items-center justify-center px-4 text-white">
        <div className="max-w-md w-full bg-obsidian-950 p-8 rounded-3xl border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-accent flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Admin Privileges Required</h2>
          <p className="text-xs text-slate-400">
            You must be authenticated as a RoamReady Store Administrator to access this management dashboard.
          </p>
          <div className="pt-2">
            <button
              onClick={async () => {
                await loginDemoAdmin();
                loadAllAdminData();
              }}
              className="w-full bg-amber-accent hover:bg-amber-400 text-obsidian-950 font-extrabold text-xs py-3.5 rounded-xl transition-colors shadow-md"
            >
              1-Click Sign In as Store Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-obsidian-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-accent text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Store Administrator
              </span>
              <span className="text-xs text-slate-400 font-mono">PAN-India Logistics Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              RoamReady Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {statusUpdateMessage && (
          <div className="p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center animate-in fade-in">
            {statusUpdateMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-300 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'products'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'customers'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'coupons'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'reviews'
                ? 'bg-obsidian-950 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Revenue</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatINR(metrics?.totalRevenue || 0)}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block">+18% this week</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Orders</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  {metrics?.totalOrders || orders.length}
                </div>
                <span className="text-[10px] text-brand-600 font-bold block">{metrics?.pendingOrders || 0} pending dispatch</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Customers</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  {metrics?.totalCustomers || customers.length}
                </div>
                <span className="text-[10px] text-slate-400 block">PAN-India verified</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Catalog SKUs</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  {products.length}
                </div>
                <span className="text-[10px] text-amber-600 font-bold block">{metrics?.lowStockCount || 0} low inventory</span>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Low Inventory Alerts (Under 20 units)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {metrics.lowStockProducts.map((p) => (
                    <div key={p._id} className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate mr-2">{p.title}</span>
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Recent Customer Transactions</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-brand-600 font-bold hover:underline">
                  View All Orders
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                      <div className="text-slate-400 text-[11px]">{ord.customerDetails.name} &bull; {ord.shippingAddress.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">{formatINR(ord.pricing.total)}</div>
                      <span className="text-[10px] font-bold uppercase text-brand-600">{ord.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Manage Travel Gear Inventory & Specifications</span>
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Travel Gear</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / MRP</th>
                    <th className="p-4">Inventory</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover rounded-xl border border-slate-100 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                          <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{p.categoryName}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900">{formatINR(p.price)}</span>
                        <span className="text-[10px] text-slate-400 line-through ml-1">{formatINR(p.originalPrice)}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleUpdateStock(p._id, -5)} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 hover:bg-slate-200">-5</button>
                          <span className={`font-bold ${p.stock < 20 ? 'text-amber-600' : 'text-slate-800'}`}>{p.stock}</span>
                          <button onClick={() => handleUpdateStock(p._id, +10)} className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 hover:bg-slate-200">+10</button>
                        </div>
                      </td>
                      <td className="p-4">
                        {p.badge && (
                          <span className="bg-obsidian-950 text-amber-accent text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Items / Total</th>
                    <th className="p-4">Dispatch Status</th>
                    <th className="p-4">BlueDart Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{ord.customerDetails.name}</div>
                        <div className="text-[10px] text-slate-400">{ord.customerDetails.email}</div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.postalCode})
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900">{formatINR(ord.pricing.total)}</span>
                        <span className="text-[10px] text-slate-400 block">{ord.items.length} gear items</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="bg-slate-100 border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 text-slate-800 focus:outline-none"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-brand-600 font-semibold">
                        {ord.tracking?.trackingNumber || 'Pending Allocation'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td className="p-4 font-bold text-slate-900">{c.name}</td>
                    <td className="p-4 text-slate-600">{c.email}</td>
                    <td className="p-4 text-slate-500 font-mono">{c.phone || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        c.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Promotional Discounts & Travel Vouchers</span>
              <button
                onClick={() => setShowCouponModal(true)}
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coupons.map((cpn) => (
                <div key={cpn.code} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-base text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                      {cpn.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{cpn.description}</p>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    Min Cart Spend: <strong>{formatINR(cpn.minimumSpend)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.userName} ({rev.userCity})</span>
                    <span className="text-amber-500 flex">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">{rev.title}</h4>
                  <p className="text-slate-600 text-xs">{rev.comment}</p>
                  <div className="text-[10px] text-slate-400 pt-1">Product: <strong className="text-slate-700">{rev.productSlug}</strong></div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Approved
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Add New Travel Gear SKU</h3>
              <button onClick={() => setShowProductModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RoamReady StealthCable TSA Lock"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="tsa-locks">TSA Locks</option>
                    <option value="luggage-tags">Luggage Tags</option>
                    <option value="packing-cubes">Packing Cubes</option>
                    <option value="baggage-straps">Baggage Straps</option>
                    <option value="foldable-duffels">Foldable Duffels</option>
                    <option value="travel-kits">Travel Kits</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Original MRP (INR) *</label>
                  <input
                    type="number"
                    required
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Zinc alloy 4-dial lock with master TSA keyhole."
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="w-1/2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  {isSavingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Create Promo Discount Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMERFLY"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs uppercase font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% discount for holiday shoppers"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    value={couponVal}
                    onChange={(e) => setCouponVal(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min Spend (INR) *</label>
                  <input
                    type="number"
                    required
                    value={couponMin}
                    onChange={(e) => setCouponMin(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-brand-500"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

