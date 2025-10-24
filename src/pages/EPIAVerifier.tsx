"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, Calendar, User } from 'lucide-react';

type Equipement = {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  numero_serie: string;
  date_mise_en_service: string | null;
  date_fin_vie: string | null;
  statut: string;
  image: string | null;
  personnel_id: number | null;
};

type Personnel = {
  id: number;
  nom: string;
  prenom: string;
};

export default function EPIAVerifier() {
  const navigate = useNavigate();
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [personnel, setPersonnel] = useState<Record<number, Personnel>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEquipementsAVerifier();
  }, []);

  const loadEquipementsAVerifier = async () => {
    setIsLoading(true);
    try {
      // Charger les équipements dont la date de fin de vie approche (dans les 30 prochains jours)
      const today = new Date();
      const in30Days = new Date();
      in30Days.setDate(today.getDate() + 30);

      const { data: equipData, error: equipError } = await supabase
        .from('equipements')
        .select('*')
        .not('date_fin_vie', 'is', null)
        .lte('date_fin_vie', in30Days.toISOString().split('T')[0])
        .order('date_fin_vie');

      if (equipError) throw equipError;

      setEquipements(equipData || []);

      // Charger les informations du personnel
      const personnelIds = [...new Set(equipData?.map(e => e.personnel_id).filter(Boolean) as number[])];
      
      if (personnelIds.length > 0) {
        const { data: personnelData, error: personnelError } = await supabase
          .from('personnel')
          .select('id, nom, prenom')
          .in('id', personnelIds);

        if (personnelError) throw personnelError;

        const personnelMap: Record<number, Personnel> = {};
        personnelData?.forEach(p => {
          personnelMap[p.id] = p;
        });
        setPersonnel(personnelMap);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des équipements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getDaysUntilExpiry = (dateString: string | null) => {
    if (!dateString) return null;
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyBadge = (daysUntilExpiry: number | null) => {
    if (daysUntilExpiry === null) return null;
    
    if (daysUntilExpiry < 0) {
      return <Badge className="bg-red-600 text-white">Expiré</Badge>;
    } else if (daysUntilExpiry <= 7) {
      return <Badge className="bg-orange-600 text-white">Urgent ({daysUntilExpiry}j)</Badge>;
    } else if (daysUntilExpiry <= 30) {
      return <Badge className="bg-yellow-600 text-white">Bientôt ({daysUntilExpiry}j)</Badge>;
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">EPI à vérifier</h1>
          </div>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {equipements.length} EPI
          </Badge>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : equipements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Aucun EPI à vérifier pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipements.map((equip) => {
              const daysUntilExpiry = getDaysUntilExpiry(equip.date_fin_vie);
              const assignedPerson = equip.personnel_id ? personnel[equip.personnel_id] : null;

              return (
                <Card key={equip.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {equip.image ? (
                          <img 
                            src={equip.image} 
                            alt={equip.type}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{equip.type}</h3>
                        </div>
                      </div>
                      {getUrgencyBadge(daysUntilExpiry)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      {equip.marque && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Marque</span>
                          <span className="font-medium">{equip.marque}</span>
                        </div>
                      )}
                      {equip.modele && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Modèle</span>
                          <span className="font-medium">{equip.modele}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">N° Série</span>
                        <span className="font-mono font-medium text-xs">{equip.numero_serie}</span>
                      </div>
                      {assignedPerson && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigné à</span>
                          <span className="font-medium flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {assignedPerson.prenom} {assignedPerson.nom}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Fin de vie
                        </span>
                        <span className="font-bold text-red-600">
                          {formatDate(equip.date_fin_vie)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/equipement/${equip.id}`)}
                      >
                        Voir détails
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-600 hover:bg-red-700"
                        onClick={() => navigate(`/controle/${equip.id}`)}
                      >
                        Contrôler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}