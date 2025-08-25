"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Gestion de Caserne
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/personnel">
            <Button variant="ghost">Personnel</Button>
          </Link>
          <Link to="/equipements">
            <Button variant="ghost">Équipements</Button>
          </Link>
          <Link to="/controles">
            <Button variant="ghost">Contrôles</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;