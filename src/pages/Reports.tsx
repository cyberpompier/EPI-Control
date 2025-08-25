import { useState, useEffect, useMemo } from 'react';
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

// ... définitions des types Equipement et Controle ici ...

export default function Reports() {
  // ... tous les useState et useEffect inchangés ...

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Rapports | EPI Control`}</title>
      </Helmet>
      
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
    </>
  );
}
