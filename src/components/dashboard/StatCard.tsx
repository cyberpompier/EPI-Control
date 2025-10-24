"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type StatCardProps = {
  title: string;
  value?: string | number;
  icon?: React.ReactNode | IconComponent;
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

function renderIcon(icon: StatCardProps['icon'], color?: StatCardProps['color']) {
  if (!icon) return null;

  const colorMap: Record<NonNullable<StatCardProps['color']>, string> = {
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };
  const colorClass = color ? colorMap[color] : 'text-muted-foreground';

  if (typeof icon === 'function') {
    const IconComp = icon as IconComponent;
    return <IconComp className={`h-4 w-4 ${colorClass}`} />;
  }

  return icon;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  // Détecter si cette carte doit afficher les contrôles conformes
  const shouldShowConformes = title.toLowerCase().includes('conforme');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon(icon, color)}
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