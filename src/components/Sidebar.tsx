"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Shield, 
  Settings, 
  LogOut,
  Wrench
} from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Accueil', href: '/' },
    { icon: Users, label: 'Personnel', href: '/personnel' },
    { icon: Shield, label: 'Équipements', href: '/equipements' },
    { icon: Wrench, label: 'Contrôles', href: '/controles' },
    { icon: Settings, label: 'Paramètres', href: '/parametres' },
  ];

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">Gestion EPI</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link 
                  to={item.href}
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <button className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};