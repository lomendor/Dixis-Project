import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PERMISSIONS, Permission, Role } from '@/types/permissions';
import { toast } from 'react-hot-toast';

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handlePermissionToggle = (permission: Permission) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.includes(permission)
      ? selectedRole.permissions.filter(p => p !== permission)
      : [...selectedRole.permissions, permission];

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions
    });
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRole),
      });

      if (!response.ok) throw new Error('Failed to save role');

      toast.success('Ο ρόλος αποθηκεύτηκε επιτυχώς');
    } catch (error) {
      toast.error('Σφάλμα κατά την αποθήκευση του ρόλου');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Διαχείριση Ρόλων</h1>
        <Button onClick={() => setSelectedRole(null)}>
          Νέος Ρόλος
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Λίστα ρόλων */}
        <div className="col-span-4">
          <Card className="p-4">
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedRole?.id === role.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Επεξεργασία ρόλου */}
        {selectedRole && (
          <div className="col-span-8">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Όνομα Ρόλου
                  </label>
                  <Input
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({
                      ...selectedRole,
                      name: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium">Δικαιώματα</h3>
                  <div className="mt-4 space-y-4">
                    {Object.entries(PERMISSIONS).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={selectedRole.permissions.includes(key as Permission)}
                            onChange={() => handlePermissionToggle(key as Permission)}
                            className="h-4 w-4 text-emerald-600 rounded border-gray-300"
                          />
                        </div>
                        <div className="ml-3">
                          <label className="font-medium text-gray-700">
                            {value.label}
                          </label>
                          <p className="text-sm text-gray-500">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                  >
                    Ακύρωση
                  </Button>
                  <Button onClick={handleSaveRole}>
                    Αποθήκευση
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 