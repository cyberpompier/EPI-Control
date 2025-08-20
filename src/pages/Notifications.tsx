import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import NotificationCard from '@/components/notifications/NotificationCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Bell, CheckCircle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map((notif: any) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    showSuccess('Notification marquée comme lue');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map((notif: any) => ({ ...notif, read: true }))
    );
    showSuccess('Toutes les notifications ont été marquées comme lues');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter((n: any) => !n.read)
      : notifications.filter((n: any) => n.type === activeTab);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <Layout>
      <Helmet>
        <title>{`Notifications | EPI Control`}</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-600">Gérez vos notifications et alertes.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="unread">Non lues</TabsTrigger>
          <TabsTrigger value="alert">Alertes</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
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
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune notification</h3>
                <p className="mt-2 text-gray-500">
                  Vous n'avez aucune notification pour le moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="unread">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
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
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune notification non lue</h3>
                <p className="mt-2 text-gray-500">
                  Vous êtes à jour avec vos notifications.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="alert">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
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
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune alerte</h3>
                <p className="mt-2 text-gray-500">
                  Aucune alerte à afficher pour le moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="info">
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
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
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune information</h3>
                <p className="mt-2 text-gray-500">
                  Aucune information à afficher pour le moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {activeTab === 'unread' && unreadCount > 0 && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleMarkAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>
      )}
    </Layout>
  );
}