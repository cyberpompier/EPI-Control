import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, Clock, CheckCircle, Plus, FileText } from 'lucide-react';
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
            alertsList.push({ id: epi.id, type: 'EPI non conforme', equipement: `${epi.marque} ${epi.modele}`, pompier: `${pompier?.prenom} ${pompier?.nom}`, date: epi.created_at });
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
      
      {/* Rest of the Dashboard component */}
    </Layout>
  );
}