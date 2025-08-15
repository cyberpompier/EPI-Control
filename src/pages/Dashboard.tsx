import Layout from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Users, AlertTriangle, CheckCircle, Clock, HardHat, Hand, Shirt } from 'lucide-react';
import RecentControls from '@/components/dashboard/RecentControls';
import PersonnelList from '@/components/dashboard/PersonnelList';

type Stats = {
  totalEquipements: number;
  totalPersonnel: number;
  controlesEnRetard: number;
  equipementsConformes: number;
  equipementsNonConformes: number;
  casquesConformes: number;
  gantsConformes: number;
  surpantalonsConformes: number;
  vestesProtectionConformes: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [
          { count: totalEquipements, error: equipementsError },
          { count: totalPersonnel, error: personnelError },
          { count: controlesEnRetard, error: retardError },
          { count: equipementsConformes, error: conformesError },
          { count: equipementsNonConformes, error: nonConformesError },
          { count: casquesConformes, error: casquesError },
          { count: gantsConformes, error: gantsError },
          { count: surpantalonsConformes, error: surpantalonsError },
          { count: vestesProtectionConformes, error: vestesError }
        ] = await Promise.all([
          supabase.from('equipements').select('*', { count: 'exact', head: true }),
          supabase.from('personnel').select('*', { count: 'exact', head: true }),
          supabase.from('controles').select('*', { count: 'exact', head: true }).lt('date_prochaine_verification', new Date().toISOString()),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'conforme'),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'non_conforme'),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'conforme').in('type', ['Casque F1', 'Casque F2']),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'conforme').eq('type', 'Gant de protection'),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'conforme').eq('type', 'Surpantalon'),
          supabase.from('equipements').select('*', { count: 'exact', head: true }).eq('statut', 'conforme').eq('type', 'Veste de protection')
        ]);

        const anyError = equipementsError || personnelError || retardError || conformesError || nonConformesError || casquesError || gantsError || surpantalonsError || vestesError;
        if (anyError) {
          throw anyError;
        }

        setStats({
          totalEquipements: totalEquipements || 0,
          totalPersonnel: totalPersonnel || 0,
          controlesEnRetard: controlesEnRetard || 0,
          equipementsConformes: equipementsConformes || 0,
          equipementsNonConformes: equipementsNonConformes || 0,
          casquesConformes: casquesConformes || 0,
          gantsConformes: gantsConformes || 0,
          surpantalonsConformes: surpantalonsConformes || 0,
          vestesProtectionConformes: vestesProtectionConformes || 0,
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Équipements" value={stats.totalEquipements} icon={Shield} color="blue" />
            <StatCard title="Total Personnel" value={stats.totalPersonnel} icon={Users} color="gray" />
            <StatCard title="Équipements Conformes" value={stats.equipementsConformes} icon={CheckCircle} color="green" />
            <StatCard title="Équipements Non-Conformes" value={stats.equipementsNonConformes} icon={AlertTriangle} color="red" />
            <StatCard title="Contrôles en Retard" value={stats.controlesEnRetard} icon={Clock} color="yellow" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>État des équipements conformes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Casques" value={stats.casquesConformes} icon={HardHat} color="green" />
                <StatCard title="Gants" value={stats.gantsConformes} icon={Hand} color="green" />
                <StatCard title="Surpantalons" value={stats.surpantalonsConformes} icon={Shield} color="green" />
                <StatCard title="Vestes de protection" value={stats.vestesProtectionConformes} icon={Shirt} color="green" />
              </div>
            </CardContent>
          </Card>
        </>
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