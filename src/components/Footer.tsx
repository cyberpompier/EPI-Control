"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Gestion de Caserne. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;