import React from 'react';
import { Users } from 'lucide-react';

const Customers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your customer database</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Customer System
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The customer management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Customers;
