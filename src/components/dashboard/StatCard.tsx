"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type StatCardProps = {
  title: string;
  value?: string | number;
  icon?: any;
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

const NonConformesTotal: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { count, error } = await supabase
        .from('controles')
        .select('id', { count: 'exact', head: true })
        .eq('resultat', 'non_conforme');

      if (error) {
        console.error('Erreur lors du comptage des contrôles non conformes:', error);
        return;
      }
      setCount(count ?? 0);
    };

    load();
  }, []);

  return <>{count !== null ? count : '—'}</>;
};

const EPIAVerifierTotal: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Récupérer tous les contrôles avec leur date de prochaine vérification
      const { data, error } = await supabase
        .from('controles')
        .select('equipement_id, date_prochaine_verification')
        .not('date_prochaine_verification', 'is', null)
        .lt('date_prochaine_verification', today);

      if (error) {
        console.error('Erreur lors du comptage des EPI à vérifier:', error);
        return;
      }

      // Compter les équipements uniques nécessitant une vérification
      const uniqueEquipements = new Set(data?.map(item => item.equipement_id) || []);
      setCount(uniqueEquipements.size);
    };

    load();
  }, []);

  return <>{count !== null ? count : '—'}</>;
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const shouldShowConformes = title.toLowerCase().includes('conforme') && !title.toLowerCase().includes('non');
  const shouldShowNonConformes = title.toLowerCase().includes('non') && title.toLowerCase().includes('conforme');
  const shouldShowEPIAVerifier = title.toLowerCase().includes('epi') && title.toLowerCase().includes('vérifier');

  const colorMap: Record<NonNullable<StatCardProps['color']>, string> = {
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200',
  };

  const iconColorMap: Record<NonNullable<StatCardProps['color']>, string> = {
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    gray: 'text-gray-600',
  };

  const textColorMap: Record<NonNullable<StatCardProps['color']>, string> = {
    red: 'text-red-700',
    green: 'text-green-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
    gray: 'text-gray-700',
  };

  const cardClass = color ? colorMap[color] : 'bg-white';
  const iconColorClass = color ? iconColorMap[color] : 'text-muted-foreground';
  const textColorClass = color ? textColorMap[color] : 'text-foreground';

  // Rendre l'icône de manière sûre
  const renderIcon = () => {
    if (!icon) return null;
    
    // Si c'est déjà un élément React valide, le cloner avec les bonnes classes
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        className: `h-5 w-5 ${iconColorClass}`,
      });
    }
    
    // Si c'est une fonction/composant, l'instancier avec les props appropriées
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className={`h-5 w-5 ${iconColorClass}`} />;
    }
    
    // Sinon ne rien afficher pour éviter l'erreur
    return null;
  };

  return (
    <Card className={`${cardClass} border-2 transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColorClass}`}>
          {shouldShowConformes ? <ConformesTotal /> : 
           shouldShowNonConformes ? <NonConformesTotal /> : 
           shouldShowEPIAVerifier ? <EPIAVerifierTotal /> :
           value}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };