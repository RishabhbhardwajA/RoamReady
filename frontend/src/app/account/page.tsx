'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  Plus,
  ShieldCheck,
  Check,
  LogOut,
  Lock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import { Address } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // New Address Modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await apiClient.put('/auth/profile', { name, phone });
      if (res.data.success) {
        updateUser(res.data.data.user);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 4000);
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      const res = await apiClient.post('/auth/addresses', {
        fullName: name,
        phone: phone || '9123456789',
        street: newStreet,
        apartment: newApartment,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        isDefault: true
      });
      if (res.data.success) {
        updateUser({ addresses: res.data.data.addresses });
        setShowAddressModal(false);
        setNewStreet('');
        setNewApartment('');
        setNewCity('');
        setNewState('');
        setNewPostalCode('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddressLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm w-full space-y-4">
          <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-xs text-slate-500">Access your saved addresses, order tracking, and flight gear warranty.</p>
          <div className="pt-2">
            <Link href="/auth/login" className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-2.5 rounded-full inline-block">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-xl">
                  {user.name[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Store Administrator
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile & Addresses</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  <span>Order History & BlueDart Tracking</span>
                </Link>
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Saved Wishlist</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Account Details */}
          <main className="lg:col-span-8 space-y-8">
            {/* Personal Details */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Personal Information
              </h2>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Registered)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                  {updateSuccess && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Updated!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                Change Password
              </h2>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl pl-9 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">New Password (min 8 chars)</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full bg-slate-100 rounded-xl pl-9 px-3 py-2 text-xs focus:outline-none focus:ring-2 ${
                          newPassword.length > 0 && newPassword.length < 8 ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-brand-500'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {newPassword.length > 0 && newPassword.length < 8 && (
                      <p className="text-[11px] text-red-500 mt-1">Must be at least 8 characters</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className={`w-full bg-slate-100 rounded-xl pl-9 px-3 py-2 text-xs focus:outline-none focus:ring-2 ${
                          confirmNewPassword.length > 0 && newPassword !== confirmNewPassword ? 'ring-2 ring-red-400 focus:ring-red-400' : confirmNewPassword.length > 0 && newPassword === confirmNewPassword ? 'ring-2 ring-emerald-400 focus:ring-emerald-400' : 'focus:ring-brand-500'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      {confirmNewPassword.length > 0 && newPassword === confirmNewPassword && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {confirmNewPassword.length > 0 && newPassword !== confirmNewPassword && (
                      <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading || (newPassword.length > 0 && newPassword.length < 8) || (confirmNewPassword.length > 0 && newPassword !== confirmNewPassword)}
                    className="bg-obsidian-950 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Saved Delivery Addresses
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.addresses && user.addresses.length > 0) ? (
                  user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs relative"
                    >
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-brand-100 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{addr.fullName}</span>
                      </div>
                      <div className="text-slate-600">{addr.street} {addr.apartment && `, ${addr.apartment}`}</div>
                      <div className="text-slate-600">{addr.city}, {addr.state} - <strong>{addr.postalCode}</strong></div>
                      <div className="text-slate-400 text-[11px] pt-1">Phone: {addr.phone}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No saved addresses yet.</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street / Flat No."
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Apartment / Landmark</label>
                <input
                  type="text"
                  placeholder="Building, Floor"
                  value={newApartment}
                  onChange={(e) => setNewApartment(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">PIN Code (6 digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newPostalCode}
                  onChange={(e) => setNewPostalCode(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="w-1/2 bg-brand-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-brand-500 transition-colors shadow-sm"
                >
                  {addressLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

