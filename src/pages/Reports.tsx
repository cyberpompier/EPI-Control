import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { FileDown, TrendingUp, AlertTriangle, Shield, Users, Calendar } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCaserne, setSelectedCaserne] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Données simulées pour les rapports
  const conformityData = [
    { name: 'Casques', conformes: 45, nonConformes: 5, enAttente: 2 },
    { name: 'Vestes', conformes: 38, nonConformes: 8, enAttente: 4 },
    { name: 'Surpantalons', conformes: 42, nonConformes: 6, enAttente: 2 },
    { name: 'Gants', conformes: 35, nonConformes: 12, enAttente: 3 },
    { name: 'Rangers', conformes: 28, nonConformes: 4, enAttente: 1 }
  ];

  const monthlyTrendData = [
    { month: 'Jan', controles: 28, conformes: 24, nonConformes: 4 },
    { month: 'Fév', controles: 32, conformes: 28, nonConformes: 4 },
    { month: 'Mar', controles: 36, conformes: 30, nonConformes: 6 },
    { month: 'Avr', controles: 30, conformes: 26, nonConformes: 4 },
    { month: 'Mai', controles: 25, conformes: 22, nonConformes: 3 },
    { month: 'Juin', controles: 38, conformes: 32, nonConformes: 6 },
    { month: 'Juil', controles: 42, conformes: 35, nonConformes: 7 },
    { month: 'Août', controles: 35, conformes: 30, nonConformes: 5 },
    { month: 'Sep', controles: 31, conformes: 27, nonConformes: 4 },
    { month: 'Oct', controles: 42, conformes: 36, nonConformes: 6 }
  ];

  const caserneData = [
    { name: 'Caserne Centrale', value: 68, color: '#DC2626' },
    { name: 'Caserne Nord', value: 52, color: '#EA580C' },
    { name: 'Caserne Sud', value: 45, color: '#D97706' },
    { name: 'Caserne Est', value: 38, color: '#CA8A04' },
    { name: 'Caserne Ouest', value: 35, color: '#65A30D' }
  ];

  const ageData = [
    { range: '0-1 an', count: 45 },
    { range: '1-2 ans', count: 38 },
    { range: '2-3 ans', count: 52 },
    { range: '3-5 ans', count: 67 },
    { range: '5+ ans', count: 36 }
  ];

  const casernes = ['Caserne Centrale', 'Caserne Nord', 'Caserne Sud', 'Caserne Est', 'Caserne Ouest'];
  const types = ['casque', 'veste', 'surpantalon', 'gants', 'rangers'];

  const exportReport = (format: 'pdf' | 'excel') => {
    // Simulation d'export
    console.log(`Export en ${format.toUpperCase()}`);
    // Dans une vraie application, vous généreriez et téléchargeriez le fichier
  };

  return (
    <Layout>
      <Helmet>
        <title>Rapports | EPI Control</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rapports et statistiques</h1>
        <p className="text-gray-600">Analyse des données des équipements et contrôles</p>
      </div>
      
      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Période</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Caserne</label>
              <Select value={selectedCaserne} onValueChange={setSelectedCaserne}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les casernes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les casernes</SelectItem>
                  {casernes.map(caserne => (
                    <SelectItem key={caserne} value={caserne}>{caserne}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'équipement</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => exportReport('pdf')} variant="outline" className="flex-1">
                <FileDown className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => exportReport('excel')} variant="outline" className="flex-1">
                <FileDown className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de conformité</p>
                <p className="text-2xl font-bold text-green-600">87.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">+2.1% ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">EPI non conformes</p>
                <p className="text-2xl font-bold text-red-600">32</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">-5 depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total équipements</p>
                <p className="text-2xl font-bold">248</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">+12 nouveaux ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contrôles ce mois</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">+12% vs mois dernier</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conformité par type d'équipement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conformityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conformes" stackId="a" fill="#22C55E" name="Conformes" />
                  <Bar dataKey="nonConformes" stackId="a" fill="#EF4444" name="Non conformes" />
                  <Bar dataKey="enAttente" stackId="a" fill="#F59E0B" name="En attente" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition par caserne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={caserneData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {caserneData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution des contrôles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="controles" stroke="#DC2626" strokeWidth={2} name="Total contrôles" />
                  <Line type="monotone" dataKey="conformes" stroke="#22C55E" strokeWidth={2} name="Conformes" />
                  <Line type="monotone" dataKey="nonConformes" stroke="#EF4444" strokeWidth={2} name="Non conformes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Âge des équipements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#DC2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}