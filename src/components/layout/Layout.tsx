"use client";

import Header from './Header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
}

const Layout = ({ children, headerTitle }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {headerTitle && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Pompier assigné : {headerTitle}</h2>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;