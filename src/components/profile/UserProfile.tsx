import { useAuth } from '@/features/auth/hooks/useAuth';
import { Tab } from '@headlessui/react';
import { User, ShoppingBag, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const { user, error } = useAuth();

  if (!user) {
    return null;
  }

  const tabs = [
    {
      key: 'profile',
      label: 'Προφίλ',
      icon: User,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Προσωπικά Στοιχεία</h3>
            <div className="mt-2 space-y-2">
              <p><strong>Όνομα:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Ρόλος:</strong> {user.role}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'orders',
      label: 'Παραγγελίες',
      icon: ShoppingBag,
      content: (
        <div className="text-center text-gray-500 py-8">
          Δεν υπάρχουν παραγγελίες ακόμα
        </div>
      )
    },
    {
      key: 'security',
      label: 'Ασφάλεια',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Αλλαγή Κωδικού</h3>
            {/* Εδώ θα μπει η φόρμα αλλαγής κωδικού */}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            {tabs.map(tab => (
              <Tab
                key={tab.key}
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-emerald-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-emerald-600'
                  )
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {tabs.map(tab => (
              <Tab.Panel
                key={tab.key}
                className={cn(
                  'rounded-xl p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2'
                )}
              >
                {tab.content}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 