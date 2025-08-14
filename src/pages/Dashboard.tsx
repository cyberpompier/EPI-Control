import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, Clock, CheckCircle, Plus, FileText, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { Helmet } from 'react-helmet';
import { useSession } from '@/components/auth/SessionProvider';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const { user, loading: userLoading } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [typeData, setTypeData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [recentControles, setRecentControles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: equipements, error: epiError } = await supabase.from('equipements').select('*');
        if (epiError) throw epiError;

        const { data: controles, error: controlesError } = await supabase.from('controles').select('*, controleur:profiles(prenom, nom), equipement:equipements(marque, modele), pompier:personnel(prenom, nom)');
        if (controlesError) throw controlesError;

        const totalEPI = equipements.length;
        const epiConformes = equipements.filter(e => e.statut === 'conforme').length;
        const epiNonConformes = equipements.filter(e => e.statut === 'non_conforme').length;
        const epiEnAttente = equipements.filter(e => e.statut === 'en_attente').length;
        
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const controlesMois = controles.filter(c => new Date(c.date_controle) >= firstDayOfMonth).length;

        const expiringSoon = equipements.filter(e => {
          const finVie = new Date(e.date_fin_vie);
          const diffTime = finVie.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 30;
        }).length;
        const alertes = epiNonConformes + expiringSoon;

        setStats({
          totalEPI,
          epiConformes,
          epiNonConformes,
          epiEnAttente,
          controlesMois,
          alertes
        });

        const typeCounts = equipements.reduce((acc, epi) => {
          acc[epi.type] = (acc[epi.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setTypeData(Object.entries(typeCounts).map(([name, value]) => ({ name, value })));
        setStatusData([
          { name: 'Conformes', value: epiConformes, color: '#22C55E' },
          { name: 'Non conformes', value: epiNonConformes, color: '#EF4444' },
          { name: 'En attente', value: epiEnAttente, color: '#F59E0B' }
        ]);

        const monthlyCounts = Array(12).fill(0).map((_, i) => ({ name: new Date(0, i).toLocaleString('fr', { month: 'short' }), controles: 0 }));
        controles.forEach(c => {
          const month = new Date(c.date_controle).getMonth();
          monthlyCounts[month].controles++;
        });
        setMonthlyData(monthlyCounts);

        const alertsList = [];
        const nonConformesRecents = equipements.filter(e => e.statut === 'non_conforme').slice(0, 2);
        for (const epi of nonConformesRecents) {
            const {data: pompier} = await supabase.from('personnel').select('nom, prenom').eq('id', epi.personnel_id).single();
            alertsList.push({ id: epi.id, type: 'EPI non conforme', equipement: `${epi.marque} ${epi.modele}`, pompier: pompier ? `${pompier.prenom} ${pompier.nom}` : 'N/A', date: epi.created_at });
        }
        setRecentAlerts(alertsList);
        setRecentControles(controles.slice(0, 4));

      } catch (error) {
        console.error("Erreur de chargement du tableau de bord:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{`Tableau de bord | EPI Control`}</title>
      </Helmet>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Bienvenue, {user?.email?.split('@')[0] || 'Utilisateur'}. Voici un aperçu de l'état de vos EPI.</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Link to="/equipements/nouveau">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un équipement
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Voir les rapports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        <StatCard title="Total EPI" value={stats.totalEPI || 0} icon={<Shield />} />
        <StatCard title="Conformes" value={stats.epiConformes || 0} icon={<CheckCircle />} color="green" />
        <StatCard title="Non conformes" value={stats.epiNonConformes || 0} icon={<AlertTriangle />} color="red" />
        <StatCard title="En attente" value={stats.epiEnAttente || 0} icon={<Clock />} color="yellow" />
        <StatCard title="Contrôles ce mois" value={stats.controlesMois || 0} icon={<ClipboardList />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contrôles mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="controles" stroke="#dc2626" name="Contrôles" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alertes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.length > 0 ? recentAlerts.map(alert => (
                <div key={alert.id} className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{alert.type}: {alert.equipement}</p>
                    <p className="text-sm text-gray-500">Pompier: {alert.pompier} - {new Date(alert.date).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">Aucune alerte récente.</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Derniers contrôles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentControles.length > 0 ? recentControles.map(controle => (
                <div key={controle.id} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{controle.equipement.marque} {controle.equipement.modele}</p>
                    <p className="text-sm text-gray-500">
                      Par {controle.controleur.prenom} {controle.controleur.nom} le {new Date(controle.date_controle).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">Aucun contrôle récent.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}