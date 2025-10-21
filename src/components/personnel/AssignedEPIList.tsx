"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import EPICard from '../epi/EPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Equipement = {
  id: string;
  type?: string;
  marque?: string;
  modele?: string;
  numero_serie?: string;
  statut?: string;
  image?: string;
  personnel_id?: number | string | null;
  [key: string]: any;
};

type AssignedEPIListProps = {
  personnelId: number | string;
  assigneeName?: string;
};

const supabaseUrl = "https://quvdxjxszquqqcvesntn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AssignedEPIList: React.FC<AssignedEPIListProps> = ({ personnelId, assigneeName }) => {
  const [epis, setEpis] = useState<Equipement[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pid = typeof personnelId === 'string' ? parseInt(personnelId, 10) : personnelId;

    supabase
      .from('equipements')
      .select('*')
      .eq('personnel_id', pid)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        setEpis(data ?? []);
      })
      .finally(() => setLoading(false));
  }, [personnelId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border">
            <CardHeader>
              <CardTitle className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!epis || epis.length === 0) {
    return <div className="text-sm text-muted-foreground">Aucun EPI assigné.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {epis.map((epi) => (
        <EPICard key={epi.id} epi={epi} assigneeName={assigneeName} />
      ))}
    </div>
  );
};

export default AssignedEPIList;