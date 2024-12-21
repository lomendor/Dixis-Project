import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
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
  const { logout, isAuthenticated, openAuthModal } = useAuthContext();
  const isUserAdmin = useAuthContext().isAdmin();
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
          <div className="flex-shrink-0 ml-4">
            <Link to="/" className="block">
              <img 
                src="/logo.png" 
                alt="Dixis" 
                className="h-12 w-auto transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Κεντρικό Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {mainNavItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-gray-600 hover:text-emerald-600 transition-colors font-medium text-lg",
                  location.pathname === item.href && "text-emerald-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Δεξί τμήμα */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Search */}
            <div className="hidden md:flex relative">
              <Input
                type="text"
                placeholder="Αναζήτηση..."
                className="w-64 pl-10 pr-4 rounded-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                onClick={openAuthModal}
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