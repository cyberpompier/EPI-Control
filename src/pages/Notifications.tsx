import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
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
      
      {/* Rest of component */}
    </Layout>
  );
}