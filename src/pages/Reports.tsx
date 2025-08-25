import { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileDown, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { supabase } from '@/lib/supabase';
import { StatCard } from '@/components/dashboard/StatCard';
import { subMonths, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
interface Equipement {
  id: string;
  type: string;
  statut: string;
  personnel: { caserne: string }[] | null;
}

interface Controle {
  id: string;
  date_controle: string;
  resultat: string;
  equipements: { type: string; personnel: { caserne: string }[] | null } | null;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [selectedCaserne, setSelectedCaserne] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [controles, setControles] = useState<Controle[]>([]);
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [casernes, setCasernes] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: controlesData, error: controlesError } = await supabase
          .from('controles')
          .select('id, date_controle, resultat, equipements(type, personnel(caserne))');
        if (controlesError) throw controlesError;
        setControles(controlesData || []);

        const { data: equipementsData, error: equipementsError } = await supabase
          .from('equipements')
          .select('id, type, statut, personnel(caserne)');
        if (equipementsError) throw equipementsError;
        setEquipements(equipementsData || []);

        const uniqueCasernes = [...new Set((equipementsData || []).map(e => e.personnel?.[0]?.caserne).filter(Boolean))];
        const uniqueTypes = [...new Set((equipementsData || []).map(e => e.type).filter(Boolean))];
        setCasernes(uniqueCasernes as string[]);
        setTypes(uniqueTypes as string[]);
      } catch (error) {
        console.error("Erreur de chargement des données pour les rapports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const filteredControles = controles.filter(c => {
      const date = new Date(c.date_controle);
      const inDateRange = dateRange?.from && dateRange?.to ? (date >= dateRange.from && date <= dateRange.to) : true;
      const matchesCaserne = selectedCaserne === 'all' || c.equipements?.personnel?.[0]?.caserne === selectedCaserne;
      const matchesType = selectedType === 'all' || c.equipements?.type === selectedType;
      return inDateRange && matchesCaserne && matchesType;
    });

    const filteredEquipements = equipements.filter(e => {
      const matchesCaserne = selectedCaserne === 'all' || e.personnel?.[0]?.caserne === selectedCaserne;
      const matchesType = selectedType === 'all' || e.type === selectedType;
      return matchesCaserne && matchesType;
    });

    return { filteredControles, filteredEquipements };
  }, [controles, equipements, dateRange, selectedCaserne, selectedType]);

  const reportStats = useMemo(() => {
    const { filteredControles, filteredEquipements } = filteredData;
    const totalEquipements = filteredEquipements.length;
    const conformes = filteredEquipements.filter(e => e.statut === 'conforme').length;
    const nonConformes = filteredEquipements.filter(e => e.statut === 'non_conforme').length;
    const enAttente = filteredEquipements.filter(e => e.statut === 'en_attente').length;

    const conformityData = [
      { name: 'Conformes', value: conformes, color: '#22C55E' },
      { name: 'Non Conformes', value: nonConformes, color: '#EF4444' },
      { name: 'En attente', value: enAttente, color: '#F59E0B' },
    ];

    const monthlyTrendData = filteredControles.reduce((acc, controle) => {
      const month = format(new Date(controle.date_controle), 'MMM yyyy', { locale: fr });
      if (!acc[month]) acc[month] = { month, controles: 0, conformes: 0, nonConformes: 0 };
      acc[month].controles++;
      if (controle.resultat === 'conforme') acc[month].conformes++;
      if (controle.resultat === 'non_conforme') acc[month].nonConformes++;
      return acc;
    }, {} as { [key: string]: any });

    return {
      totalEquipements,
      conformes,
      nonConformes,
      enAttente,
      totalControles: filteredControles.length,
      conformityData,
      monthlyTrendData: Object.values(monthlyTrendData).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()),
    };
  }, [filteredData]);

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log(`Export en ${format.toUpperCase()}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>{`Rapports | EPI Control`}</title>
      </Helmet>

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Rapports et Statistiques</h1>
          <p className="text-gray-600">Analysez les données de contrôle des équipements.</p>
        </div>
        <Button onClick={() => exportReport('pdf')} className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700">
          <FileDown className="h-4 w-4 mr-2" />
          Exporter le rapport
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={selectedCaserne} onValueChange={setSelectedCaserne}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les casernes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les casernes</SelectItem>
              {casernes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Équipements analysés" value={reportStats.totalEquipements} icon={Shield} color="blue" />
        <StatCard title="Contrôles effectués" value={reportStats.totalControles} icon={Users} color="gray" />
        <StatCard title="Conformes" value={reportStats.conformes} icon={CheckCircle} color="green" />
        <StatCard title="Non Conformes" value={reportStats.nonConformes} icon={AlertTriangle} color="red" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tendance des contrôles mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportStats.monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conformes" stackId="a" fill="#22C55E" name="Conformes" />
                <Bar dataKey="nonConformes" stackId="a" fill="#EF4444" name="Non Conformes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition de la conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportStats.conformityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportStats.conformityData.map((entry, index) => (
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
    </Layout>
  );
}
