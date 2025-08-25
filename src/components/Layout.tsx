"use client";

import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;