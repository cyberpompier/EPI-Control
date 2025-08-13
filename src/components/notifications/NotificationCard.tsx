import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'reminder' | 'info' | 'success';
  read: boolean;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationCard({
  id,
  title,
  message,
  date,
  type,
  read,
  onMarkAsRead
}: NotificationCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <Bell className="h-5 w-5 text-gray-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-100';
      case 'reminder':
        return 'bg-blue-50 border-blue-100';
      case 'info':
        return 'bg-gray-50 border-gray-100';
      case 'success':
        return 'bg-green-50 border-green-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <Card className={`${getTypeColor()} ${!read ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <div className="flex items-center space-x-2">
          {getTypeIcon()}
          <h3 className="font-semibold">{title}</h3>
          {!read && (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
              Nouveau
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm mb-3">{message}</p>
        {!read && (
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => onMarkAsRead(id)}
            >
              Marquer comme lu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}