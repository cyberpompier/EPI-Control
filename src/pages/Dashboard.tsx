import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, Clock, Users, CheckCircle, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Helmet } from 'react-helmet';
import { useSession } from '@/components/auth/SessionProvider';

export default function Dashboard() {
  const { user, loading } = useSession();
  
  // Données simulées pour les statistiques
  const stats = {
    totalEPI: 248,
    epiConformes: 203,
    epiNonConformes: 32,
    epiEnAttente: 13,
    controlesMois: 42,
    alertes: 8
  };
  
  // Données simulées pour les graphiques
  const typeData = [
    { name: 'Casques', value: 62 },
    { name: 'Vestes', value: 58 },
    { name: 'Surpantalons', value: 56 },
    { name: 'Gants', value: 42 },
    { name: 'Rangers', value: 30 }
  ];
  
  const statusData = [
    { name: 'Conformes', value: 203, color: '#22C55E' },
    { name: 'Non conformes', value: 32, color: '#EF4444' },
    { name: 'En attente', value: 13, color: '#F59E0B' }
  ];
  
  const monthlyData = [
    { name: 'Jan', controles: 28 },
    { name: 'Fév', controles: 32 },
    { name: 'Mar', controles: 36 },
    { name: 'Avr', controles: 30 },
    { name: 'Mai', controles: 25 },
    { name: 'Juin', controles: 38 },
    { name: 'Juil', controles: 42 },
    { name: 'Août', controles: 35 },
    { name: 'Sep', controles: 31 },
    { name: 'Oct', controles: 42 },
    { name: 'Nov', controles: 0 },
    { name: 'Déc', controles: 0 }
  ];
  
  // Données simulées pour les alertes récentes
  const recentAlerts = [
    { id: 1, type: 'EPI expiré', equipement: 'Casque F1', pompier: 'Martin Dupont', date: '2023-10-15' },
    { id: 2, type: 'Contrôle à planifier', equipement: 'Veste F1', pompier: 'Sophie Durand', date: '2023-10-18' },
    { id: 3, type: 'EPI non conforme', equipement: 'Gants d\'intervention', pompier: 'Thomas Bernard', date: '2023-10-20' }
  ];
  
  // Données simulées pour les contrôles récents
  const recentControles = [
    { id: 1, equipement: 'Casque F1', pompier: 'Jean Dupont', resultat: 'conforme', date: '2023-10-22' },
    { id: 2, equipement: 'Veste d\'intervention', pompier: 'Marie Martin', resultat: 'non_conforme', date: '2023-10-21' },
    { id: 3, equipement: 'Rangers', pompier: 'Pierre Dubois', resultat: 'conforme', date: '2023-10-20' },
    { id: 4, equipement: 'Surpantalon', pompier: 'Lucie Petit', resultat: 'conforme', date: '2023-10-19' }
  ];

  if (loading) {
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
          value={stats.totalEPI} 
          icon={<Shield size={20} />}
          color="blue"
        />
        <StatCard 
          title="EPI conformes" 
          value={stats.epiConformes} 
          icon={<CheckCircle size={20} />}
          description={`${Math.round((stats.epiConformes / stats.totalEPI) * 100)}% du total`}
          color="green"
        />
        <StatCard 
          title="EPI non conformes" 
          value={stats.epiNonConformes} 
          icon={<AlertTriangle size={20} />}
          description={`${Math.round((stats.epiNonConformes / stats.totalEPI) * 100)}% du total`}
          color="red"
        />
        <StatCard 
          title="EPI en attente de contrôle" 
          value={stats.epiEnAttente} 
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard 
          title="Contrôles ce mois" 
          value={stats.controlesMois} 
          icon={<FileText size={20} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Alertes actives" 
          value={stats.alertes} 
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
              {recentControles.map((controle) => (
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
                    <h4 className="font-medium">{controle.equipement}</h4>
                    <p className="text-sm text-gray-600">
                      {controle.pompier}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(controle.date).toLocaleDateString('fr-FR')}
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