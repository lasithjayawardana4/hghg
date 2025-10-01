import React from 'react';
import { BarChart3 } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">View detailed reports and analytics</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Reports System
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The reports and analytics functionality will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Reports;
