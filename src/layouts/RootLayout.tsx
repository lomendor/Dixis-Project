import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { AuthProvider } from '@/context/AuthContext';
import { useAuthContext } from '@/context/AuthContext';

export const RootLayout: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
      />
    </div>
  );
}; 