import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Today\'s Sales',
      value: `$${stats?.revenue?.today?.toLocaleString() || '0'}`,
      change: stats?.revenue?.change || '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: stats?.transactions?.today || '0',
      change: stats?.transactions?.change || '+8.2%',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      changeColor: 'text-green-600'
    },
    {
      title: 'Products',
      value: stats?.products?.total || '0',
      change: `+${stats?.products?.lowStock || 0} low stock`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      changeColor: stats?.products?.lowStock > 0 ? 'text-orange-600' : 'text-gray-600'
    },
    {
      title: 'Customers',
      value: stats?.customers?.total || '0',
      change: stats?.customers?.change || '+3.1%',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      changeColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn btn-secondary"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                  <p className={`text-sm mt-1 ${card.changeColor}`}>
                    {card.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn btn-primary justify-start">
              <ShoppingBag className="w-4 h-4" />
              New Sale
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <Package className="w-4 h-4" />
              Add Product
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <Users className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Low Stock Alerts
          </h3>
          {stats?.products?.lowStock > 0 ? (
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {stats.products.lowStock} products are running low
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Consider restocking soon
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All products are well stocked
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Trend
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart will be implemented here</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
