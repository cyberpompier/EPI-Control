"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Gestion du Personnel</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gray-300">Accueil</Link></li>
            <li><Link to="/personnel" className="hover:text-gray-300">Personnel</Link></li>
            <li><Link to="/equipements" className="hover:text-gray-300">Équipements</Link></li>
            <li><Link to="/controles" className="hover:text-gray-300">Contrôles</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;