import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens, setUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (token && refreshToken) {
      // Αποθήκευση των tokens
      setTokens(token, refreshToken);
      
      // Ανάκτηση των στοιχείων χρήστη
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
          toast.success('Επιτυχής σύνδεση!');
          navigate('/');
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          toast.error('Σφάλμα κατά τη σύνδεση');
          navigate('/login');
        });
    } else {
      toast.error('Η σύνδεση απέτυχε');
      navigate('/login');
    }
  }, [searchParams, navigate, setTokens, setUser]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );
} 