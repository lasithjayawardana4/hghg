import React from 'react';
import { Package } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product inventory</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Inventory System
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The inventory management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Inventory;
