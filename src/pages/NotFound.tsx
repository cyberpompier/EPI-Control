"use client";

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-lg border bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
        <p className="text-gray-600 mb-6">La ressource demandée n’existe pas ou a été déplacée.</p>
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Revenir à l’accueil
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300 transition"
          >
            Aller au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}