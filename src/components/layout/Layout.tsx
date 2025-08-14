"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const Layout = ({ children, headerTitle }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {headerTitle && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Pompier assigné : {headerTitle}</h2>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;