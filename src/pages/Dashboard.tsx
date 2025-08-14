import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, Clock, CheckCircle, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Helmet } from 'react-helmet';
import { useSession } from '@/components/auth/SessionProvider';
import { supabase } from '@/lib/supabase';
import { EPI, Controle } from '@/types/index';

export default function Dashboard() {
  const { user, loading: userLoading } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [typeData, setTypeData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);
  const [recentControles, setRecentControles] = useState<Controle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: equipements, error: epiError } = await supabase.from('equipements').select('*');
        if (epiError) throw epiError;

        const { data: controles, error: controlesError } = await supabase.from('controles').select('*, controleur:profiles(prenom, nom), equipement:equipements(marque, modele), pompier:personnel(prenom, nom)');
        if (controlesError) throw controlesError;

        // Calculate stats
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

        // Type data
        const typeCounts = equipements.reduce((acc, epi) => {
          acc[epi.type] = (acc[epi.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setTypeData(Object.entries(typeCounts).map(([name, value]) => ({ name, value })));

        // Status data
        setStatusData([
          { name: 'Conformes', value: epiConformes, color: '#22C55E' },
          { name: 'Non conformes', value: epiNonConformes, color: '#EF4444' },
          { name: 'En attente', value: epiEnAttente, color: '#F59E0B' }
        ]);

        // Monthly data
        const monthlyCounts = Array(12).fill(0).map((_, i) => ({ name: new Date(0, i).toLocaleString('fr', { month: 'short' }), controles: 0 }));
        controles.forEach(c => {
          const month = new Date(c.date_controle).getMonth();
          monthlyCounts[month].controles++;
        });
        setMonthlyData(monthlyCounts);

        // Recent alerts
        const alertsList = [];
        const nonConformesRecents = equipements.filter(e => e.statut === 'non_conforme').slice(0, 2);
        for (const epi of nonConformesRecents) {
            const {data: pompier} = await supabase.from('personnel').select('nom, prenom').eq('id', epi.personnel_id).single();
            alertsList.push({ id: epi.id, type: 'EPI non conforme', equipement: `${epi.marque} ${epi.modele}`, pompier: `${pompier?.prenom} ${pompier?.nom}`, date: epi.created_at });
        }
        setRecentAlerts(alertsList);

        // Recent controles
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
        <title>Tableau de bord | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue, {user?.email?.split('@')[0] || 'Utilisateur'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total des EPI" 
          value={stats.totalEPI || 0} 
          icon={<Shield size={20} />}
          color="blue"
        />
        <StatCard 
          title="EPI conformes" 
          value={stats.epiConformes || 0} 
          icon={<CheckCircle size={20} />}
          description={stats.totalEPI > 0 ? `${Math.round((stats.epiConformes / stats.totalEPI) * 100)}% du total` : '0% du total'}
          color="green"
        />
        <StatCard 
          title="EPI non conformes" 
          value={stats.epiNonConformes || 0} 
          icon={<AlertTriangle size={20} />}
          description={stats.totalEPI > 0 ? `${Math.round((stats.epiNonConformes / stats.totalEPI) * 100)}% du total` : '0% du total'}
          color="red"
        />
        <StatCard 
          title="EPI en attente de contrôle" 
          value={stats.epiEnAttente || 0} 
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard 
          title="Contrôles ce mois" 
          value={stats.controlesMois || 0} 
          icon={<FileText size={20} />}
        />
        <StatCard 
          title="Alertes actives" 
          value={stats.alertes || 0} 
          icon={<Bell size={20} />}
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par type d'équipement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#DC2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">État des équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contrôles mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="controles" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Alertes récentes</CardTitle>
            <Link to="/notifications">
              <Button variant="outline" size="sm">Voir tout</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start p-3 bg-red-50 rounded-md border border-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">{alert.type}</h4>
                    <p className="text-sm text-gray-600">
                      {alert.equipement} - {alert.pompier}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentAlerts.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Aucune alerte récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Contrôles récents</CardTitle>
            <Link to="/controles">
              <Button variant="outline" size="sm">Voir tout</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentControles.map((controle: any) => (
                <div key={controle.id} className="flex items-start p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className={`h-5 w-5 rounded-full mr-3 mt-0.5 flex items-center justify-center ${
                    controle.resultat === 'conforme' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {controle.resultat === 'conforme' ? 
                      <CheckCircle className="h-4 w-4" /> : 
                      <AlertTriangle className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium">{controle.equipement?.marque} {controle.equipement?.modele}</h4>
                    <p className="text-sm text-gray-600">
                      {controle.pompier?.prenom} {controle.pompier?.nom}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(controle.date_controle).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentControles.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Aucun contrôle récent
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <Link to="/controles/nouveau">
          <Button size="lg" className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </Layout>
  );
}