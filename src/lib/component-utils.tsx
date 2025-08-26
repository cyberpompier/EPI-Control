import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

export function getStatusColor(statut: string) {
  switch (statut) {
    case 'en_service':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'en_reparation':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hors_service':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'en_attente':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusIcon(statut: string) {
  switch (statut) {
    case 'en_service':
      return <CheckCircle className="w-4 h-4" />;
    case 'en_reparation':
      return <AlertCircle className="w-4 h-4" />;
    case 'hors_service':
      return <XCircle className="w-4 h-4" />;
    case 'en_attente':
      return <Clock className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}