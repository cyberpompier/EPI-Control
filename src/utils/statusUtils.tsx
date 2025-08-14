import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'conforme':
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case 'non_conforme':
      return <XCircle className="h-4 w-4 mr-1" />;
    case 'en_attente':
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'conforme':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'non_conforme':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'en_attente':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};