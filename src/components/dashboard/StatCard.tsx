"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import type { LucideIcon } from 'lucide-react';

type StatCardColor = 'red' | 'green' | 'blue' | 'yellow' | 'gray';

type StatCardProps = {
  title: string;
  description?: string;
  // Accepter un composant d'icône (ex: Shield, Users, etc.)
  icon?: LucideIcon;
  // Valeur si on n'utilise pas le cumul auto
  value?: number | string;
  // Activer le cumul des contrôles 'conforme'
  conformeCumul?: boolean;
  // Couleur thématique pour l'icône
  color?: StatCardColor;
};

const colorClasses: Record<StatCardColor, { bg: string; fg: string }> = {
  red: { bg: 'bg-red-100', fg: 'text-red-600' },
  green: { bg: 'bg-green-100', fg: 'text-green-600' },
  blue: { bg: 'bg-blue-100', fg: 'text-blue-600' },
  yellow: { bg: 'bg-yellow-100', fg: 'text-yellow-600' },
  gray: { bg: 'bg-gray-100', fg: 'text-gray-600' },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  description,
  icon,
  value,
  conformeCumul = false,
  color = 'gray',
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conformeCumul) return;

    let isMounted = true;
    (async () => {
      setLoading(true);
      const { count: total, error } = await supabase
        .from('controles')
        .select('id', { count: 'exact', head: true })
        .eq('resultat', 'conforme');

      if (!isMounted) return;
      if (error) {
        console.error('Erreur lors du cumul des contrôles conformes:', error);
        setCount(0);
      } else {
        setCount(total ?? 0);
      }
      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [conformeCumul]);

  const displayValue = conformeCumul ? (loading ? '—' : (count ?? 0)) : value ?? '—';
  const IconComp = icon;
  const { bg, fg } = colorClasses[color];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {IconComp ? (
          <div className={`rounded-md p-2 ${bg}`}>
            <IconComp className={`h-5 w-5 ${fg}`} />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        </div>
        {description ? <p className="text-xs text-muted-foreground mt-1">{description}</p> : null}
      </CardContent>
    </Card>
  );
};

export default StatCard;
export { StatCard };