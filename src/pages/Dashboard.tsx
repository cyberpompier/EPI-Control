import Layout from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import RecentControls from '@/components/dashboard/RecentControls';
import PersonnelList from '@/components/dashboard/PersonnelList';

type Stats = {
  totalEquipements: number;
  totalPersonnel: number;
  controlesEnRetard: number;
  equipementsConformes: number;
  equipementsNonConformes: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { count: totalEquipements, error: equipementsError } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true });

        const { count: totalPersonnel, error: personnelError } = await supabase
          .from('personnel')
          .select('*', { count: 'exact', head: true });

        // Note: This is a simplified query. Real-world logic for late controls might be more complex.
        const { count: controlesEnRetard, error: retardError } = await supabase
          .from('controles')
          .select('*', { count: 'exact', head: true })
          .lt('date_prochaine_verification', new Date().toISOString());

        const { count: equipementsConformes, error: conformesError } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'conforme');
        
        const { count: equipementsNonConformes, error: nonConformesError } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'non_conforme');

        if (equipementsError || personnelError || retardError || conformesError || nonConformesError) {
          throw equipementsError || personnelError || retardError || conformesError || nonConformesError;
        }

        setStats({
          totalEquipements: totalEquipements || 0,
          totalPersonnel: totalPersonnel || 0,
          controlesEnRetard: controlesEnRetard || 0,
          equipementsConformes: equipementsConformes || 0,
          equipementsNonConformes: equipementsNonConformes || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Tableau de bord | EPI Control</title>
      </Helmet>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble du système de contrôle des EPI.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard title="Total Équipements" value={stats.totalEquipements} icon={Shield} color="blue" />
          <StatCard title="Total Personnel" value={stats.totalPersonnel} icon={Users} color="gray" />
          <StatCard title="Équipements Conformes" value={stats.equipementsConformes} icon={CheckCircle} color="green" />
          <StatCard title="Équipements Non-Conformes" value={stats.equipementsNonConformes} icon={AlertTriangle} color="red" />
          <StatCard title="Contrôles en Retard" value={stats.controlesEnRetard} icon={Clock} color="yellow" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentControls />
        </div>
        <div>
          <PersonnelList />
        </div>
      </div>
    </Layout>
  );
}