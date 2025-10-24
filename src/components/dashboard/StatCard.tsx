"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type StatCardProps = {
  title: string;
  value?: string | number;
  icon?: React.ReactNode | IconComponent; // accepte élément JSX, composant fonction ou forwardRef
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

  // Déjà un élément React => on le clone pour ajouter la classe si possible
  if (React.isValidElement(icon)) {
    const prev = (icon.props as any)?.className ?? '';
    return React.cloneElement(icon as React.ReactElement, {
      className: `${prev} h-4 w-4 ${colorClass}`.trim(),
    });
  }

  // Si on reçoit un composant (function) OU un forwardRef (objet avec $$typeof/render)
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    // Utiliser createElement pour couvrir les cas forwardRef
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return React.createElement(icon as any, { className: `h-4 w-4 ${colorClass}` });
  }

  return null;
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