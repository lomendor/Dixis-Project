import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const loadingToast = toast.loading('Σύνδεση...', {
      position: 'top-center'
    });

    try {
      const success = await login({ email, password });
      if (success) {
        toast.dismiss(loadingToast);
        toast.success('Επιτυχής σύνδεση!', {
          position: 'top-center',
          duration: 2000
        });
        onClose();
        // Καθαρίζουμε τα πεδία
        setEmail('');
        setPassword('');
        if (isAdmin()) {
          navigate('/admin');
        }
      } else {
        toast.dismiss(loadingToast);
        setError('Λάθος email ή κωδικός');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      setError('Προέκυψε σφάλμα κατά τη σύνδεση');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Καλώς ήρθατε πίσω
              </Dialog.Title>
              <p className="mt-2 text-sm text-gray-600">
                Συνδεθείτε στο λογαριασμό σας
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="name@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Κωδικός
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Να με θυμάσαι
                  </label>
                </div>
                <div className="text-sm">
                  <a href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                    Ξεχάσατε τον κωδικό;
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Δεν έχετε λογαριασμό;{' '}
                <a href="/register" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  Εγγραφείτε εδώ
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 