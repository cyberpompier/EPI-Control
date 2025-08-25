"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Gestion du Personnel
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
              >
                Accueil
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/personnel')}
              >
                Personnel
              </Button>
            </li>
            <li>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/personnel/new')}
              >
                Ajouter
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}