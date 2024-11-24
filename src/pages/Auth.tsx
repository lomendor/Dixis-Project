import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../stores/authStore';

function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data from the actual form element
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate login - In production, this would be an API call
    setTimeout(() => {
      // Admin credentials for testing
      if (email === 'admin@dixis.gr' && password === 'admin123') {
        const adminUser = {
          id: 'admin1',
          name: 'Administrator',
          email: 'admin@dixis.gr',
          role: 'admin' as const,
        };
        
        login(adminUser, 'fake-token');
        toast.success('Καλώς ήρθατε, Administrator!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Λάθος στοιχεία σύνδεσης');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Σύνδεση</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Σύνδεση...' : 'Σύνδεση'}
          </button>
        </form>

        {/* Admin credentials helper - Remove in production */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Admin Credentials (για δοκιμή):</strong><br />
            Email: admin@dixis.gr<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;