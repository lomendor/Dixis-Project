import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { LoginCredentials } from '@/features/auth/types/user';
import { BaseAuthLayout } from '@/components/common/Layout/BaseAuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError, loading, isAdmin, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  // Καθαρίζουμε τα σφάλματα όταν αλλάζουν τα πεδία
  useEffect(() => {
    if (formError) setFormError('');
  }, [formData]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = isAdmin() ? '/admin' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Παρακαλώ εισάγετε ένα έγκυρο email');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const loadingToast = toast.loading('Σύνδεση...', {
      position: 'top-center'
    });
    
    try {
      const success = await login(formData);
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('Επιτυχής σύνδεση!', {
          position: 'top-center',
          duration: 2000
        });
      } else if (authError) {
        toast.error(authError, {
          position: 'top-center',
          duration: 3000
        });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Σφάλμα κατά τη σύνδεση:', err);
      toast.error('Σφάλμα κατά τη σύνδεση. Παρακαλώ δοκιμάστε ξανά.', {
        position: 'top-center',
        duration: 3000
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  if (loading) {
    return (
      <BaseAuthLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      </BaseAuthLayout>
    );
  }

  return (
    <BaseAuthLayout>
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Τίτλος */}
        <div className="text-center">
          <img 
            src="/dixis-logo.png" 
            alt="Dixis Logo" 
            className="mx-auto h-14 w-auto mb-4 transition-transform hover:scale-105" 
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Καλώς ήρθατε πίσω
          </h2>
          <p className="text-sm text-gray-600">
            Ή{' '}
            <Link 
              to="/register" 
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              δημιουργήστε νέο λογαριασμό
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Εισάγετε το email σας"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Κωδικός
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Εισάγετε τον κωδικό σας"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
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
            <Link 
              to="/forgot-password" 
              className="text-sm text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
            >
              Ξεχάσατε τον κωδικό;
            </Link>
          </div>

          {/* Error messages */}
          {(formError || authError) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <p className="text-sm text-red-700">
                {formError || authError}
              </p>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Σύνδεση...' : 'Σύνδεση'}
          </button>
        </form>
      </div>
    </BaseAuthLayout>
  );
} 