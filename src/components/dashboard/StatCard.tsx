"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type StatCardProps = {
  title: string;
  value?: string | number;
  icon?: React.ReactNode | IconComponent; // accepter soit un élément JSX, soit un composant d'icône
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
};

const ConformesTotal: React.FC<{ fallback?: string | number }> = ({ fallback }) => {
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

  return <>{count !== null ? count : (fallback ?? '—')}</>;
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

  // Si on reçoit un composant (ex: Shield), on l'instancie
  if (typeof icon === 'function') {
    const IconComp = icon as IconComponent;
    return <IconComp className={`h-4 w-4 ${colorClass}`} />;
  }

  // Sinon, on suppose que c'est déjà un ReactNode prêt à être rendu
  return icon;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {renderIcon(icon, color)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <ConformesTotal fallback={value} />
        </div>
      </CardContent>
    </Card>
  );
}

// Export nommé pour compatibilité
export { StatCard };