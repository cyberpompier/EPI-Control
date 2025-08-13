import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import NotificationCard from '@/components/notifications/NotificationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Bell, CheckCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'reminder' | 'info' | 'success';
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Données simulées pour les notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'EPI expiré',
      message: 'Le casque F1 XF de Jean Dupont a dépassé sa date de fin de vie. Un remplacement est nécessaire.',
      date: '2023-10-22T09:30:00',
      type: 'alert',
      read: false
    },
    {
      id: '2',
      title: 'Contrôle à planifier',
      message: 'La veste d\'intervention de Marie Martin doit être contrôlée avant le 30/10/2023.',
      date: '2023-10-21T14:15:00',
      type: 'reminder',
      read: false
    },
    {
      id: '3',
      title: 'EPI non conforme',
      message: 'Les gants d\'intervention de Thomas Bernard ont été déclarés non conformes lors du dernier contrôle. Des actions correctives sont requises.',
      date: '2023-10-20T11:45:00',
      type: 'alert',
      read: true
    },
    {
      id: '4',
      title: 'Nouveau contrôle enregistré',
      message: 'Le contrôle du surpantalon de Lucie Petit a été enregistré avec succès. Résultat: Conforme.',
      date: '2023-10-19T16:20:00',
      type: 'success',
      read: true
    },
    {
      id: '5',
      title: 'Rappel de maintenance',
      message: 'Une maintenance préventive est recommandée pour les casques MSA F1 XF mis en service avant janvier 2022.',
      date: '2023-10-18T10:00:00',
      type: 'info',
      read: true
    },
    {
      id: '6',
      title: 'Nouvel équipement ajouté',
      message: 'De nouveaux rangers Haix Fire Eagle ont été ajoutés à l\'inventaire et sont disponibles pour attribution.',
      date: '2023-10-17T09:10:00',
      type: 'info',
      read: true
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Dans une vraie application, vous récupéreriez les données depuis Supabase
        // const { data, error } = await supabase.from('notifications').select('*');
        // if (error) throw error;
        // setNotifications(data);
        
        // Simulation de chargement
        setTimeout(() => {
          setNotifications(mockNotifications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    showSuccess('Notification marquée comme lue');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    showSuccess('Toutes les notifications ont été marquées comme lues');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <Helmet>
        <title>Notifications | EPI Control</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </h1>
          <p className="text-gray-600">Alertes et rappels concernant les équipements</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            className="mt-4 sm:mt-0"
            onClick={handleMarkAllAsRead}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unread">Non lues {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          <TabsTrigger value="alert">Alertes</TabsTrigger>
          <TabsTrigger value="reminder">Rappels</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              id={notification.id}
              title={notification.title}
              message={notification.message}
              date={notification.date}
              type={notification.type}
              read={notification.read}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucune notification</h3>
          <p className="mt-2 text-gray-500">
            Vous n'avez aucune notification {activeTab !== 'all' && 'dans cette catégorie'}.
          </p>
        </div>
      )}
    </Layout>
  );
}