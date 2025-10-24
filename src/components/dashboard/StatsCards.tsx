"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Package, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { supabase } from '@/integrations/supabase/client';

export default function StatsCards() {
  const [totalEquipements, setTotalEquipements] = useState<number>(0);
  const [totalPersonnel, setTotalPersonnel] = useState<number>(0);

  useEffect(() => {
    const loadStats = async () => {
      const { count: equipCount } = await supabase
        .from('equipements')
        .select('id', { count: 'exact', head: true });

      const { count: persCount } = await supabase
        .from('personnel')
        .select('id', { count: 'exact', head: true });

      setTotalEquipements(equipCount ?? 0);
      setTotalPersonnel(persCount ?? 0);
    };

    loadStats();
  }, []);

  const statItems = [
    {
      title: 'Contrôles Conformes',
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Contrôles Non Conformes',
      icon: XCircle,
      color: 'red' as const,
    },
    {
      title: 'Total Équipements',
      value: totalEquipements,
      icon: Package,
      color: 'blue' as const,
    },
    {
      title: 'Total Personnel',
      value: totalPersonnel,
      icon: Users,
      color: 'gray' as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <StatCard 
          key={index} 
          title={item.title}
          value={item.value}
          icon={<item.icon className="h-4 w-4" />}
          color={item.color}
        />
      ))}
    </div>
  );
}