"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: any;
  handleLogout: () => void;
}

const Header = ({ user, handleLogout }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800">
      <div className="flex items-center">
        <Link to="/profile" className="flex items-center text-white">
          <User size={20} className="mr-1" />
          <span>
            {user?.user_metadata?.full_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Utilisateur'}
          </span>
        </Link>
      </div>
      <div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-gray-200">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
};

export default Header;