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
  AlertTriangle,
  CheckCircle2,
  Truck,
  TrendingUp,
  ShieldCheck,
  X,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
  Layers,
  Activity,
  Crown,
  Zap,
  UserCheck,
  UserPlus,
  Lock,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient, formatINR } from '@/lib/api';
import { Product, Order, User, Coupon, Review, AdminMetrics } from '@/types';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'reviews' | 'team';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700 border-amber-200',
  confirmed:  'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipped:    'bg-brand-100 text-brand-700 border-brand-200',
  delivered:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
};

const TEAM_ROLE_COLORS: Record<string, string> = {
  'Founder & Super Admin':       'bg-amber-100 text-amber-800 border-amber-300 font-black',
  'Operations & Dispatch Lead':  'bg-blue-100 text-blue-800 border-blue-300 font-bold',
  'Inventory & Warehouse Lead':  'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
  'Customer Support Specialist': 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
  'Catalog & Product Manager':   'bg-pink-100 text-pink-800 border-pink-300 font-bold',
  'Store Co-Manager':            'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Unauthenticated login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Product Modal
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

  // Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponVal, setCouponVal] = useState('10');
  const [couponMin, setCouponMin] = useState('499');

  // Team Member Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamPassword, setTeamPassword] = useState('RoamTeam2026!');
  const [teamRole, setTeamRole] = useState('Operations & Dispatch Lead');
  const [teamPhone, setTeamPhone] = useState('+91 98765 00000');
  const [isSavingTeamMember, setIsSavingTeamMember] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAllAdminData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [metricsRes, prodRes, ordRes, custRes, cpnRes, revRes, teamRes] = await Promise.all([
        apiClient.get('/admin/metrics').catch(() => null),
        apiClient.get('/admin/products').catch(() => null),
        apiClient.get('/admin/orders').catch(() => null),
        apiClient.get('/admin/customers').catch(() => null),
        apiClient.get('/admin/coupons').catch(() => null),
        apiClient.get('/admin/reviews').catch(() => null),
        apiClient.get('/admin/team').catch(() => null),
      ]);
      if (metricsRes?.data?.data?.metrics) setMetrics(metricsRes.data.data.metrics);
      if (prodRes?.data?.data?.products)   setProducts(prodRes.data.data.products);
      if (ordRes?.data?.data?.orders)      setOrders(ordRes.data.data.orders);
      if (custRes?.data?.data?.customers)  setCustomers(custRes.data.data.customers);
      if (cpnRes?.data?.data?.coupons)     setCoupons(cpnRes.data.data.coupons);
      if (revRes?.data?.data?.reviews)     setReviews(revRes.data.data.reviews);
      if (teamRes?.data?.data?.team)       setTeamMembers(teamRes.data.data.team);
      if (isRefresh) showToast('Dashboard refreshed successfully');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAdminManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const ok = await login(loginEmail, loginPassword);
      if (!ok) {
        setLoginError('Invalid credentials or unauthorized account.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Ensure account has admin privileges.');
    } finally {
      setLoginLoading(false);
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
        categoryName: newCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
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
          originCountry: 'India',
        },
        variants: [{
          id: `var-${Date.now()}`,
          name: 'Standard Edition',
          sku: `RR-${Date.now().toString().slice(-4)}`,
          colorName: 'Midnight Black',
          colorHex: '#0F172A',
          size: 'Standard',
          image: newImage,
          stockCount: Number(newStock),
          inStock: true,
        }],
      };
      const res = await apiClient.post('/admin/products', payload);
      if (res.data.success) {
        setProducts([res.data.data.product, ...products]);
        setShowProductModal(false);
        setNewTitle('');
        setNewShortDesc('');
        showToast('Product added to catalog!');
      }
    } catch (err) {
      showToast('Failed to create product', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product from the catalog?')) return;
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      showToast('Product removed from catalog');
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleUpdateStock = async (id: string, delta: number) => {
    const prod = products.find(p => p._id === id);
    if (!prod) return;
    const newSt = Math.max(0, prod.stock + delta);
    try {
      await apiClient.put(`/admin/products/${id}`, { stock: newSt });
      setProducts(products.map(p => p._id === id ? { ...p, stock: newSt } : p));
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiClient.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by store administrator.`,
      });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? res.data.data.order : o));
        showToast(`Order status → ${newStatus}`);
      }
    } catch (e) {
      showToast('Failed to update order status', 'error');
    }
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
        expiresAt: new Date(Date.now() + 90 * 86400000),
      });
      if (res.data.success) {
        setCoupons([...coupons, res.data.data.coupon]);
        setShowCouponModal(false);
        setCouponCode('');
        setCouponDesc('');
        showToast('Coupon created!');
      }
    } catch (e) {
      showToast('Failed to create coupon', 'error');
    }
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTeamMember(true);
    try {
      const res = await apiClient.post('/admin/team', {
        name: teamName,
        email: teamEmail,
        password: teamPassword,
        teamRole,
        phone: teamPhone
      });
      if (res.data.success) {
        setTeamMembers([...teamMembers, res.data.data.member]);
        setShowTeamModal(false);
        setTeamName('');
        setTeamEmail('');
        setTeamPhone('+91 98765 00000');
        showToast(`Team member ${teamName} added successfully!`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add team member', 'error');
    } finally {
      setIsSavingTeamMember(false);
    }
  };

  const handleDeleteTeamMember = async (id: string, email: string, name: string) => {
    if (email === 'rishabh@roamready.com' || email === 'admin@roamready.com') {
      alert('Cannot delete the primary Founder & Super Admin account.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke admin portal access for ${name} (${email})?`)) return;
    try {
      const res = await apiClient.delete(`/admin/team/${id}`);
      if (res.data.success) {
        setTeamMembers(teamMembers.filter(m => m._id !== id));
        showToast(`Revoked access for ${name}`);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to remove team member', 'error');
    }
  };

  // ── UNAUTHENTICATED VIEW ──────────────────────────────────────────────────
  if (!user || user.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(135deg, #090e17 0%, #0f172a 40%, #1e293b 80%, #090e17 100%)' }}
      >
        {/* animated blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative glass-dark max-w-lg w-full p-8 sm:p-10 text-left space-y-6 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Crown className="w-7 h-7 text-obsidian-950" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">RoamReady Command Center</h2>
            <p className="text-xs text-slate-400">
              Hidden management console for store administrators & team leads.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-2xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Manual Admin / Team Member Sign In Form */}
          <form onSubmit={handleAdminManualLogin} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Admin / Team Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@roamready.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              <span>{loginLoading ? 'Authenticating Staff...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
              ← Return to RoamReady Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING SKELETON ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #e0eaff 0%, #f0f4ff 50%, #e8f5e9 100%)' }}
      >
        <div className="glass-panel px-10 py-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-brand-600 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-slate-600">Loading Command Center…</p>
          <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'overview',   label: 'Overview',   icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'products',   label: 'Products',   icon: <Package className="w-4 h-4" />,   count: products.length },
    { key: 'orders',     label: 'Orders',     icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
    { key: 'customers',  label: 'Customers',  icon: <Users className="w-4 h-4" />,     count: customers.length },
    { key: 'team',       label: 'Team & Staff', icon: <UserCheck className="w-4 h-4" />, count: teamMembers.length },
    { key: 'coupons',    label: 'Coupons',    icon: <Tag className="w-4 h-4" />,       count: coupons.length },
    { key: 'reviews',    label: 'Reviews',    icon: <Star className="w-4 h-4" />,      count: reviews.length },
  ];

  // ── MAIN DASHBOARD ────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #f0f4ff 40%, #e0f2fe 70%, #d1fae5 100%)' }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-red-500 text-white shadow-red-500/30'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── HEADER ── */}
        <div className="glass-dark p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-400/20">
                {user.teamRole || 'Store Administrator'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Live Team Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              RoamReady Command Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Signed in as <strong className="text-slate-200">{user.name}</strong> ({user.email})</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadAllAdminData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 glass-pill bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all border border-white/15"
            >
              View Store
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>
        </div>

        {/* ── NAV TABS ── */}
        <div className="glass-panel p-2 flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-obsidian-950 text-white shadow-lg shadow-obsidian-950/20'
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════ TAB: OVERVIEW ════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Gross Revenue',
                  value: formatINR(metrics?.totalRevenue || 0),
                  sub: '+18% this week',
                  subColor: 'text-emerald-600',
                  icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
                  iconBg: 'bg-emerald-50',
                },
                {
                  label: 'Total Orders',
                  value: String(metrics?.totalOrders || orders.length),
                  sub: `${metrics?.pendingOrders || 0} pending dispatch`,
                  subColor: 'text-brand-600',
                  icon: <ShoppingBag className="w-5 h-5 text-brand-600" />,
                  iconBg: 'bg-brand-50',
                },
                {
                  label: 'Team & Staff',
                  value: String(teamMembers.length),
                  sub: 'Active administrators',
                  subColor: 'text-purple-600',
                  icon: <UserCheck className="w-5 h-5 text-purple-500" />,
                  iconBg: 'bg-purple-50',
                },
                {
                  label: 'Catalog SKUs',
                  value: String(products.length),
                  sub: `${metrics?.lowStockCount || 0} low inventory`,
                  subColor: 'text-amber-600',
                  icon: <Package className="w-5 h-5 text-amber-500" />,
                  iconBg: 'bg-amber-50',
                },
              ].map(card => (
                <div key={card.label} className="glass-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{card.label}</span>
                    <div className={`w-9 h-9 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{card.value}</div>
                  <span className={`text-[11px] font-bold ${card.subColor}`}>{card.sub}</span>
                </div>
              ))}
            </div>

            {/* Low Stock Alerts */}
            {metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 && (
              <div className="glass-panel border border-amber-200/60 p-5 space-y-4" style={{ background: 'rgba(254,243,199,0.6)' }}>
                <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Low Inventory Alerts — Under 20 units
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {metrics.lowStockProducts.map(p => (
                    <div key={p._id} className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 truncate mr-2">{p.title}</span>
                      <span className="font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900">Recent Transactions</h3>
                <button onClick={() => setActiveTab('orders')} className="flex items-center gap-1 text-xs text-brand-600 font-bold hover:underline">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 6).map(ord => (
                  <div key={ord._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-mono font-bold text-slate-900">{ord.orderNumber}</div>
                      <div className="text-slate-400 text-[11px]">{ord.customerDetails.name} · {ord.shippingAddress.city}</div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-black text-slate-900">{formatINR(ord.pricing.total)}</div>
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${STATUS_COLORS[ord.orderStatus] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="py-6 text-center text-xs text-slate-400">No orders yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: TEAM & STAFF ════════════════════ */}
        {activeTab === 'team' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-900">Team & Staff Roster</p>
                <p className="text-xs text-slate-500">
                  {teamMembers.length} team members with active portal access · Manage roles & invitations
                </p>
              </div>
              <button
                onClick={() => setShowTeamModal(true)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-all hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                Add Team Member
              </button>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-4">Team Member</th>
                      <th className="p-4">Designation & Role</th>
                      <th className="p-4">Contact Phone</th>
                      <th className="p-4">Access Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {teamMembers.map(member => (
                      <tr key={member._id} className="hover:bg-brand-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                              {member.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{member.name}</span>
                                {(member.isPrimaryAdmin || member.email === 'rishabh@roamready.com' || member.email === 'admin@roamready.com') && (
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                                    Primary Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[11px] px-3 py-1 rounded-full border ${TEAM_ROLE_COLORS[member.teamRole || ''] || 'bg-slate-100 text-slate-700 border-slate-200 font-bold'}`}>
                            {member.teamRole || 'Store Administrator'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-[11px]">
                          {member.phone || '+91 98765 43210'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active Portal Access</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {(!member.isPrimaryAdmin && member.email !== 'rishabh@roamready.com' && member.email !== 'admin@roamready.com') ? (
                            <button
                              onClick={() => handleDeleteTeamMember(member._id, member.email, member.name)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Revoke Portal Access"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic font-mono pr-2">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {teamMembers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-sm text-slate-400">
                          No team members registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: PRODUCTS ════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-900">Product Catalog</p>
                <p className="text-xs text-slate-500">{products.length} SKUs · Manage inventory & gear specs</p>
              </div>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / MRP</th>
                      <th className="p-4">Inventory</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-brand-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.thumbnail} alt={p.title} className="w-11 h-11 object-cover rounded-2xl border border-slate-100 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1 max-w-[160px]">{p.title}</div>
                              <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold">{p.categoryName}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-slate-900">{formatINR(p.price)}</span>
                          <span className="text-[10px] text-slate-400 line-through ml-1.5">{formatINR(p.originalPrice)}</span>
                          <span className="ml-1.5 text-[10px] font-bold text-emerald-600">{p.discountPercent}% off</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleUpdateStock(p._id, -5)} className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-[11px] flex items-center justify-center transition-colors">-5</button>
                            <span className={`font-black text-sm w-8 text-center ${p.stock < 20 ? 'text-amber-600' : 'text-slate-800'}`}>{p.stock}</span>
                            <button onClick={() => handleUpdateStock(p._id, +10)} className="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-[11px] flex items-center justify-center transition-colors">+10</button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-700">★ {p.rating?.toFixed(1) || '—'}</span>
                        </td>
                        <td className="p-4">
                          {p.badge && (
                            <span className="bg-obsidian-950 text-amber-accent text-[9px] font-black px-2.5 py-1 rounded-full">{p.badge}</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-sm text-slate-400">
                          No products in catalog
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: ORDERS ════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-900">Order Dispatch Console</p>
                <p className="text-xs text-slate-500">{orders.length} orders · Update dispatch & tracking status</p>
              </div>
              <div className="flex gap-2">
                {(['pending','confirmed','shipped','delivered'] as string[]).map(s => (
                  <span key={s} className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${STATUS_COLORS[s] || ''}`}>
                    {orders.filter(o => o.orderStatus === s).length} {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {orders.map(ord => (
                      <tr key={ord._id} className="hover:bg-brand-50/30 transition-colors">
                        <td className="p-4 font-mono font-black text-slate-900 text-[11px]">{ord.orderNumber}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{ord.customerDetails.name}</div>
                          <div className="text-[10px] text-slate-400">{ord.customerDetails.email}</div>
                        </td>
                        <td className="p-4 text-slate-600">
                          {ord.shippingAddress.city}, {ord.shippingAddress.state}
                          <div className="text-[10px] text-slate-400">{ord.shippingAddress.postalCode}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-slate-900">{formatINR(ord.pricing.total)}</span>
                          <div className="text-[10px] text-slate-400">{ord.items.length} items</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            ord.payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {ord.payment.method?.toUpperCase()} · {ord.payment.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.orderStatus}
                            onChange={e => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-[11px] font-bold rounded-xl px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-brand-600 font-bold">
                          {ord.tracking?.trackingNumber || <span className="text-slate-400">Pending</span>}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-sm text-slate-400">No orders yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: CUSTOMERS ════════════════════ */}
        {activeTab === 'customers' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4">
              <p className="text-sm font-black text-slate-900">Customer Registry</p>
              <p className="text-xs text-slate-500">{customers.length} registered shoppers · PAN-India</p>
            </div>
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Addresses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {customers.map(c => (
                      <tr key={c._id} className="hover:bg-brand-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {c.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-bold text-slate-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{c.email}</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            c.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 font-mono">{c.phone || '—'}</td>
                        <td className="p-4 text-slate-500">{c.addresses?.length || 0} saved</td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-sm text-slate-400">No customers yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: COUPONS ════════════════════ */}
        {activeTab === 'coupons' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-slate-900">Promo Code Manager</p>
                <p className="text-xs text-slate-500">{coupons.length} active codes</p>
              </div>
              <button
                onClick={() => setShowCouponModal(true)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-lg shadow-brand-600/25 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c, i) => (
                <div key={i} className="glass-card p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-lg text-obsidian-950 font-mono tracking-wide">{c.code}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                    </div>
                    <span className="bg-brand-50 text-brand-700 text-xs font-black px-3 py-1.5 rounded-full">
                      {c.discountValue}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">Min spend {formatINR(c.minimumSpend)}</span>
                    {c.maxDiscount && <span className="bg-slate-100 px-2 py-0.5 rounded-full">Max ₹{c.maxDiscount} off</span>}
                  </div>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="col-span-3 glass-panel p-10 text-center text-sm text-slate-400">
                  No coupons yet. Create your first promo code!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════ TAB: REVIEWS ════════════════════ */}
        {activeTab === 'reviews' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="glass-panel p-4">
              <p className="text-sm font-black text-slate-900">Customer Reviews</p>
              <p className="text-xs text-slate-500">{reviews.length} verified reviews across all products</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(r => (
                <div key={r._id} className="glass-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{r.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.userName} · {r.userCity}</div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1">
                      <span className="text-amber-400 font-black text-sm">{'★'.repeat(r.rating)}</span>
                      <span className="text-slate-300 text-sm">{'★'.repeat(5 - r.rating)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                  <div className="flex items-center gap-2 text-[10px]">
                    {r.verifiedPurchase && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                    <span className="text-slate-400 font-mono">{r.productSlug}</span>
                    <span className="ml-auto text-slate-400">{r.helpfulVotes} helpful</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="col-span-2 glass-panel p-10 text-center text-sm text-slate-400">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ══════════════ MODAL: ADD TEAM MEMBER ══════════════ */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Add Team Member</h3>
                  <p className="text-[11px] text-slate-500">Grant portal access to staff & operations</p>
                </div>
              </div>
              <button onClick={() => setShowTeamModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateTeamMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Gupta"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav@roamready.com"
                  value={teamEmail}
                  onChange={e => setTeamEmail(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Team Designation / Role *</label>
                <select
                  value={teamRole}
                  onChange={e => setTeamRole(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                >
                  <option value="Operations & Dispatch Lead">Operations & Dispatch Lead</option>
                  <option value="Inventory & Warehouse Lead">Inventory & Warehouse Lead</option>
                  <option value="Customer Support Specialist">Customer Support Specialist</option>
                  <option value="Catalog & Product Manager">Catalog & Product Manager</option>
                  <option value="Store Co-Manager">Store Co-Manager</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Password *</label>
                  <input
                    type="text"
                    required
                    value={teamPassword}
                    onChange={e => setTeamPassword(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={teamPhone}
                    onChange={e => setTeamPhone(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="w-1/2 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTeamMember}
                  className="w-1/2 bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-full text-xs shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50"
                >
                  {isSavingTeamMember ? 'Creating Account…' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: ADD PRODUCT ══════════════ */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Add New Travel Gear</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TSA 3-Dial Combination Padlock"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Category *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  >
                    <option value="tsa-locks">TSA Locks</option>
                    <option value="luggage-straps">Luggage Straps</option>
                    <option value="packing-cubes">Packing Cubes</option>
                    <option value="neck-pillows">Neck Pillows</option>
                    <option value="travel-adapters">Travel Adapters</option>
                    <option value="travel-kits">Travel Kits</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Badge</label>
                  <select
                    value={newBadge}
                    onChange={e => setNewBadge(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                  >
                    <option value="New Launch">New Launch</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Top Rated">Top Rated</option>
                    <option value="Limited">Limited</option>
                    <option value="">No Badge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Price (₹) *</label>
                  <input type="number" required value={newPrice} onChange={e => setNewPrice(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">MRP (₹) *</label>
                  <input type="number" required value={newOriginalPrice} onChange={e => setNewOriginalPrice(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Stock *</label>
                  <input type="number" required value={newStock} onChange={e => setNewStock(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Image URL *</label>
                <input type="url" required value={newImage} onChange={e => setNewImage(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Short Description</label>
                <input type="text" placeholder="e.g. Zinc alloy 4-dial lock with master TSA keyhole."
                  value={newShortDesc} onChange={e => setNewShortDesc(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)}
                  className="w-1/2 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProduct}
                  className="w-1/2 bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-full text-xs shadow-lg shadow-brand-600/25 transition-all disabled:opacity-50">
                  {isSavingProduct ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: CREATE COUPON ══════════════ */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/70 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900">Create Promo Code</h3>
              <button onClick={() => setShowCouponModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Coupon Code *</label>
                <input type="text" required placeholder="e.g. SUMMERFLY25"
                  value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Description *</label>
                <input type="text" required placeholder="e.g. 25% off for summer travelers"
                  value={couponDesc} onChange={e => setCouponDesc(e.target.value)}
                  className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Discount % *</label>
                  <input type="number" required min={1} max={80} value={couponVal} onChange={e => setCouponVal(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">Min Spend (₹) *</label>
                  <input type="number" required value={couponMin} onChange={e => setCouponMin(e.target.value)}
                    className="w-full bg-white/70 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCouponModal(false)}
                  className="w-1/2 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="w-1/2 bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-full text-xs shadow-lg shadow-brand-600/25 transition-all">
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
