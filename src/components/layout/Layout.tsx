"use client";

import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Valeurs par défaut pour l'utilisateur et la déconnexion
  const user = {
    email: "user@example.com",
    user_metadata: {
      full_name: "John Doe",
      first_name: "John"
    }
  };

  const handleLogout = () => {
    console.log("Déconnexion appelée");
  };

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
};

export default Layout;