import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, headerTitle }) => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            {headerTitle && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Pompier assigné : {headerTitle}</h2>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;