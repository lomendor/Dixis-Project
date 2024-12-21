import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Αναφορές & Αναλύσεις</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Εξαγωγή Αναφοράς
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder για γραφήματα */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Πωλήσεις ανά Κατηγορία</h2>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Τάσεις Πωλήσεων</h2>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Πίνακας Στατιστικών */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Αναλυτικά Στατιστικά</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Μετρική</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Τρέχων Μήνας</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Προηγ. Μήνας</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Μεταβολή</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Συνολικές Πωλήσεις</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">€124,500</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">€115,200</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-emerald-600">+8.1%</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Νέοι Πελάτες</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">245</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">198</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-emerald-600">+23.7%</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Μέση Παραγγελία</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">€85.40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">€78.90</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-emerald-600">+8.2%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 