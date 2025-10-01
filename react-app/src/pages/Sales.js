import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Sales = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales & POS</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your point of sale operations</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Sales System
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The sales and POS functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Sales;
