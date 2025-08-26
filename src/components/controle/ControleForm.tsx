"use client";

import React, { useState } from 'react';
import * as z from 'zod';
import { EPI } from '@/types/epi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ControleFormProps {
  epi: EPI;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ControleForm = ({ epi, onSubmit, onCancel }: ControleFormProps) => {
  const [dateControle, setDateControle] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [resultat, setResultat] = useState<'conforme' | 'non_conforme' | 'en_attente'>('en_attente');
  const [observations, setObservations] = useState('');
  const [actionsCorrectives, setActionsCorrectives] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date_controle: dateControle,
      resultat,
      observations,
      actions_correctives: actionsCorrectives,
      equipement_id: epi.id
    });
  };

  const getResultatColor = (resultat: string) => {
    switch (resultat) {
      case 'conforme': return 'text-green-600';
      case 'non_conforme': return 'text-red-600';
      case 'en_attente': return 'text-yellow-600';
      default: return '';
    }
  };

  const getResultatIcon = (resultat: string) => {
    switch (resultat) {
      case 'conforme': return <CheckCircle className="h-5 w-5" />;
      case 'non_conforme': return <XCircle className="h-5 w-5" />;
      case 'en_attente': return <AlertTriangle className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contrôle de l'équipement</span>
          <div className="flex items-center">
            {getResultatIcon(resultat)}
            <span className={`ml-2 ${getResultatColor(resultat)}`}>
              {resultat === 'conforme' && 'Conforme'}
              {resultat === 'non_conforme' && 'Non conforme'}
              {resultat === 'en_attente' && 'En attente'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="epi">Équipement</Label>
              <div className="p-3 border rounded-md bg-gray-50">
                <p className="font-medium">{epi.type}</p>
                <p className="text-sm text-gray-500">{epi.marque} - {epi.modele}</p>
                <p className="text-sm text-gray-500">N° série: {epi.numero_serie}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="dateControle">Date du contrôle</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="dateControle"
                  type="date"
                  value={dateControle}
                  onChange={(e) => setDateControle(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="resultat">Résultat</Label>
            <Select value={resultat} onValueChange={(value: any) => setResultat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un résultat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conforme">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Conforme
                  </div>
                </SelectItem>
                <SelectItem value="non_conforme">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    Non conforme
                  </div>
                </SelectItem>
                <SelectItem value="en_attente">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    En attente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Détails sur l'état de l'équipement..."
              rows={3}
            />
          </div>

          {resultat === 'non_conforme' && (
            <div>
              <Label htmlFor="actionsCorrectives">Actions correctives</Label>
              <Textarea
                id="actionsCorrectives"
                value={actionsCorrectives}
                onChange={(e) => setActionsCorrectives(e.target.value)}
                placeholder="Actions à entreprendre pour corriger les défauts..."
                rows={3}
                required={resultat === 'non_conforme'}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer le contrôle
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ControleForm;