"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Shield, 
  FileText, 
  User, 
  LogOut 
} from 'lucide-react';
import { useSession } from '@/components/auth/SessionProvider';
import { useIsMobile } from '@/hooks/useIsMobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useSession(); // Fixed: use session instead of user
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // TODO: Implement logout functionality
    console.log('Logout functionality needs to be implemented');
  };

  const navItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Personnel', path: '/personnel', icon: Users },
    { name: 'Équipements', path: '/epi', icon: Shield },
    { name: 'Contrôles', path: '/controles', icon: FileText },
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              FireCheck
            </Link>
          </div>

          {isMobile ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          ) : (
            <nav className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button 
                    key={item.path}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    asChild
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMenuOpen && isMobile && (
          <nav className="pb-4 flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button 
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  asChild
                  className="justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to={item.path}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;