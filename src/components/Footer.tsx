"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Gestion du Personnel. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}