"use client";

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Package className="h-5 w-5" />
          <span className="font-semibold">EPI Manager</span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <Home className="h-4 w-4" />
            Accueil
          </NavLink>

          <NavLink
            to="/equipements"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <Package className="h-4 w-4" />
            Équipements
          </NavLink>

          <Link to="/equipements" className="sm:hidden">
            <Button size="sm" variant="secondary">Équipements</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;