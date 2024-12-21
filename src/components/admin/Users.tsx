import React, { useState } from 'react';
import { UserPlus, Search, Filter, MoreVertical, Edit2, Trash2, Shield } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Γιώργος Παπαδόπουλος',
    email: 'g.papadopoulos@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-15 14:30'
  },
  {
    id: 2,
    name: 'Μαρία Κωνσταντίνου',
    email: 'm.konstantinou@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-03-14 09:15'
  },
  {
    id: 3,
    name: 'Νίκος Αντωνίου',
    email: 'n.antoniou@example.com',
    role: 'editor',
    status: 'inactive',
    lastLogin: '2024-03-10 16:45'
  }
];

const roles = [
  { id: 'admin', name: 'Διαχειριστής', description: 'Πλήρης πρόσβαση σε όλες τις λειτουργίες' },
  { id: 'manager', name: 'Διευθυντής', description: 'Διαχείριση χρηστών και περιεχομένου' },
  { id: 'editor', name: 'Συντάκτης', description: 'Επεξεργασία περιεχομένου' },
  { id: 'viewer', name: 'Θεατής', description: 'Μόνο προβολή περιεχομένου' }
];

export function Users() {
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Χρήστες & Δικαιώματα</h1>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Νέος Χρήστης
        </button>
      </div>

      {/* Φίλτρα & Αναζήτηση */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Αναζήτηση χρήστη..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-4">
          <select 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Όλοι οι ρόλοι</option>
            <option value="admin">Διαχειριστής</option>
            <option value="manager">Διευθυντής</option>
            <option value="editor">Συντάκτης</option>
          </select>
          <select
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Όλες οι καταστάσεις</option>
            <option value="active">Ενεργοί</option>
            <option value="inactive">Ανενεργοί</option>
          </select>
          <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Πίνακας Χρηστών */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Χρήστης</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ρόλος</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Τελευταία Σύνδεση</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role === 'admin' ? 'Διαχειριστής' :
                       user.role === 'manager' ? 'Διευθυντής' :
                       'Συντάκτης'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {user.status === 'active' ? 'Ενεργός' : 'Ανενεργός'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-600 hover:text-emerald-600 transition-colors rounded hover:bg-gray-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600 transition-colors rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-emerald-600 transition-colors rounded hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ρόλοι & Δικαιώματα */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            Ρόλοι & Δικαιώματα
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {roles.map((role) => (
            <div key={role.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer">
              <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 