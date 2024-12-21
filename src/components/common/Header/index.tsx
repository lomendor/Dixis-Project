import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { CartPreview } from '@/components/cart/CartPreview';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ShoppingCart, 
  Menu, 
  User, 
  Search as SearchIcon,
  History,
  Mail,
  UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { href: '/products', label: 'Προϊόντα' },
  { href: '/producers', label: 'Παραγωγοί' }
];

const menuItems = [
  { href: '/our-story', label: 'Η Ιστορία μας', icon: History },
  { href: '/contact', label: 'Επικοινωνία', icon: Mail }
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const isUserAdmin = useAuth().isAdmin();
  const { totalItems } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Reset states when route changes
  useEffect(() => {
    setShowCartPreview(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const success = await logout();
      if (success) {
        navigate('/');
      } else {
        console.error('Αποτυχία αποσύνδεσης');
      }
    } catch (error) {
      console.error('Σφάλμα κατά την αποσύνδεση:', error);
    } finally {
      setIsLoggingOut(false);
      setShowMobileMenu(false);
    }
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Αριστερά */}
          <Link to="/" className="flex items-center">
            <img 
              src="/dixis-logo.png" 
              alt="Dixis Logo" 
              className="h-8 w-auto transition-transform hover:scale-105" 
            />
          </Link>

          {/* Navigation - Κέντρο */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-gray-600 hover:text-emerald-600 transition-colors",
                  location.pathname === item.href && "text-emerald-600 font-medium"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions - Δεξιά */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Αναζήτηση..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Cart */}
            <div className="relative mr-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-emerald-50"
                onClick={() => navigate('/cart')}
                onMouseEnter={() => setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                {isAuthenticated && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              {showCartPreview && isAuthenticated && (
                <div 
                  className="absolute top-full right-0 mt-2"
                  onMouseEnter={() => setShowCartPreview(true)}
                  onMouseLeave={() => setShowCartPreview(false)}
                >
                  <CartPreview 
                    onClose={() => setShowCartPreview(false)}
                    onMouseEnter={() => setShowCartPreview(true)}
                    onMouseLeave={() => setShowCartPreview(false)}
                  />
                </div>
              )}
            </div>

            {/* Auth Icon */}
            {!isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/login')}
                className="relative hover:bg-emerald-50 group"
                aria-label="Σύνδεση"
              >
                <UserCircle2 className="h-6 w-6 text-gray-600 group-hover:text-emerald-600 transition-all duration-200" />
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-5 w-5" />
                </Button>
                {isUserAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                  >
                    Διαχείριση
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="min-w-[100px]"
                >
                  {isLoggingOut ? 'Αποσύνδεση...' : 'Αποσύνδεση'}
                </Button>
              </div>
            )}

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMobileMenu && (
          <div className="absolute top-full right-0 w-56 mt-2 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
} 