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
    console.log(`Export en ${format.toUpperCase()}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>{`Rapports | EPI Control`}</title>
      </Helmet>
      
      {/* Rest of the component */}
    </Layout>
  );
}