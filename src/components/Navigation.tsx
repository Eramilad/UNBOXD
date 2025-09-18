import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
                Unboxd
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#services" className="text-white hover:text-gray-300 text-sm font-medium">
                Request Move
              </a>
              <a href="/signup" className="text-white hover:text-gray-300 text-sm font-medium">
                Drive & Earn
              </a>
              <a 
                href="/corporate" 
                className="text-white hover:text-gray-300 text-sm font-medium cursor-pointer"
                onClick={() => navigate('/corporate')}
              >
                Corporate
              </a>
              <a href="#about" className="text-white hover:text-gray-300 text-sm font-medium">
                About
              </a>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Globe className="h-4 w-4 text-white" />
            <span className="text-white text-sm">EN</span>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/provider-login')}
              className="text-white hover:bg-gray-800"
            >
              Help
            </Button>
            
            {user ? (
              <>
                <span className="text-white text-sm">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="text-white hover:bg-gray-800"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-white hover:bg-gray-800"
                >
                  Log in
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-6"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black">
            <a href="#services" className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium">
              Request Move
            </a>
            <a href="/signup" className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium">
              Drive & Earn
            </a>
            <a 
              href="/corporate" 
              className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium cursor-pointer"
              onClick={() => navigate('/corporate')}
            >
              Corporate Solutions
            </a>
            <a href="#about" className="text-white hover:text-gray-300 block px-3 py-2 text-base font-medium">
              About
            </a>
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="flex items-center px-3 space-y-2 flex-col">
                {user ? (
                  <>
                    <span className="text-white text-sm mb-2">
                      Welcome, {user.email?.split('@')[0]}
                    </span>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full text-white hover:bg-gray-800"
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/auth')}
                      className="w-full text-white hover:bg-gray-800"
                    >
                      Log in
                    </Button>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="w-full bg-white text-black hover:bg-gray-100 rounded-full"
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
