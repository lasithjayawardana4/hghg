import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Super Admin Panel
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="/dashboard" element={<SuperAdminDashboardContent />} />
        </Routes>
      </main>
    </div>
  );
};

const SuperAdminDashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage all shops and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Shops</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Shops</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">22</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked Shops</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
            <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Super Admin Panel
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The super admin functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
