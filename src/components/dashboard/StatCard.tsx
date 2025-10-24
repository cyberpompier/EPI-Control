"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value?: string | number;
  icon?: LucideIcon | React.ReactNode;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
};

const ConformesTotal: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { count, error } = await supabase
        .from('controles')
        .select('id', { count: 'exact', head: true })
        .eq('resultat', 'conforme');

      if (error) {
        console.error('Erreur lors du comptage des contrôles conformes:', error);
        return;
      }
      setCount(count ?? 0);
    };

    load();
  }, []);

  return <>{count !== null ? count : '—'}</>;
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const shouldShowConformes = title.toLowerCase().includes('conforme');

  const colorMap: Record<NonNullable<StatCardProps['color']>, string> = {
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };
  const colorClass = color ? colorMap[color] : 'text-muted-foreground';

  // Rendre l'icône correctement
  const renderIcon = () => {
    if (!icon) return null;
    
    // Si c'est un composant Lucide (fonction), l'instancier
    if (typeof icon === 'function') {
      const Icon = icon as LucideIcon;
      return <Icon className={`h-4 w-4 ${colorClass}`} />;
    }
    
    // Sinon c'est déjà un ReactNode
    return icon;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {shouldShowConformes ? <ConformesTotal /> : value}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };