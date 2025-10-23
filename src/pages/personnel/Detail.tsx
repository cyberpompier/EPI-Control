import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import EPICard from '@/components/epi/EPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabase';
import { Pompier, EPI } from '@/types/index';
import { ArrowLeft, Mail, MapPin, Shield, Plus, FileText, Pencil } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function PersonnelDetail() {
  const { id } = useParams<{ id: string }>();
  const [pompier, setPompier] = useState<Pompier | null>(null);
  const [editedPompier, setEditedPompier] = useState<Pompier | null>(null);
  const [equipements, setEquipements] = useState<EPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const { data: pompierData, error: pompierError } = await supabase.from('personnel').select('*').eq('id', id).single();
        if (pompierError) throw pompierError;
        setPompier(pompierData);
        setEditedPompier(pompierData);

        const { data: equipementsData, error: equipementsError } = await supabase.from('equipements').select('*').eq('personnel_id', id);
        if (equipementsError) throw equipementsError;
        setEquipements(equipementsData || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditedPompier(pompier);
  };

  const handleSave = async () => {
    if (!editedPompier) return;
    try {
      const { error } = await supabase
        .from('personnel')
        .update({
          nom: editedPompier.nom,
          prenom: editedPompier.prenom,
          email: editedPompier.email,
          caserne: editedPompier.caserne,
          grade: editedPompier.grade,
          matricule: editedPompier.matricule
        })
        .eq('id', editedPompier.id);

      if (error) throw error;
      setPompier(editedPompier);
      setIsEditing(false);
      toast.success('Informations mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleInputChange = (field: keyof Pompier, value: string) => {
    if (editedPompier) setEditedPompier({ ...editedPompier, [field]: value });
  };

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Chargement...</div></Layout>;
  if (!pompier) return <Layout><div className="text-center py-12">Pompier non trouvé</div></Layout>;

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'capitaine': return 'bg-red-100 text-red-800 border-red-200';
      case 'lieutenant': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'adjudant': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sergent': return 'bg-green-100 text-green-800 border-green-200';
      case 'caporal': case 'caporal-chef': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: equipements.length,
    conformes: equipements.filter(e => e.statut === 'conforme').length,
    nonConformes: equipements.filter(e => e.statut === 'non_conforme').length,
    enAttente: equipements.filter(e => e.statut === 'en_attente').length
  };

  return (
    <Layout>
      <Helmet><title>{pompier.prenom} {pompier.nom} | EPI Control</title></Helmet>

      <div className="mb-6">
        <Link to="/personnel" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour au personnel
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={pompier.photo || undefined} alt={`${pompier.prenom} ${pompier.nom}`} />
              <AvatarFallback>{getInitials(pompier.nom || '', pompier.prenom || '')}</AvatarFallback>
            </Avatar>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input value={editedPompier?.prenom || ''} onChange={e => handleInputChange('prenom', e.target.value)} placeholder="Prénom"/>
                  <Input value={editedPompier?.nom || ''} onChange={e => handleInputChange('nom', e.target.value)} placeholder="Nom"/>
                  <Input value={editedPompier?.grade || ''} onChange={e => handleInputChange('grade', e.target.value)} placeholder="Grade"/>
                  <Input value={editedPompier?.caserne || ''} onChange={e => handleInputChange('caserne', e.target.value)} placeholder="Caserne"/>
                  <Input value={editedPompier?.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder="Email"/>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" onClick={handleCancel}>Annuler</Button>
                    <Button onClick={handleSave}>Enregistrer</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{pompier.prenom} {pompier.nom}</h1>
                  <Badge className={`${getGradeColor(pompier.grade || '')} mt-1`} variant="outline">{pompier.grade}</Badge>
                  <p className="text-gray-600">{pompier.caserne}</p>
                </>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button onClick={handleEdit}><Pencil className="mr-2 h-4 w-4" /> Modifier</Button>
              <Link to={`/equipements/nouveau?pompier=${pompier.id}`}>
                <Button className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/> Ajouter un équipement</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats EPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="text-center"><div className="text-2xl font-bold">{stats.total}</div><div className="text-sm text-gray-500">Total EPI</div></CardContent></Card>
          <Card><CardContent className="text-center"><div className="text-2xl font-bold text-green-600">{stats.conformes}</div><div className="text-sm text-gray-500">Conformes</div></CardContent></Card>
          <Card><CardContent className="text-center"><div className="text-2xl font-bold text-red-600">{stats.nonConformes}</div><div className="text-sm text-gray-500">Non conformes</div></CardContent></Card>
          <Card><CardContent className="text-center"><div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div><div className="text-sm text-gray-500">En attente</div></CardContent></Card>
        </div>

        {/* Équipements */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Équipements assignés</CardTitle>
            <Link to={`/equipements/nouveau?pompier=${pompier.id}`}>
              <Button size="sm" className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/> Ajouter un équipement</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {equipements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipements.map(epi => (
                  <EPICard
                    key={epi.id}
                    epi={{
                      ...epi,
                      personnel: { id: pompier.id, nom: pompier.nom, prenom: pompier.prenom }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucun équipement assigné</h3>
                <p className="mt-2 text-gray-500 mb-4">Ce pompier n'a pas encore d'équipement assigné.</p>
                <Link to={`/equipements/nouveau?pompier=${pompier.id}`}>
                  <Button className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2"/> Ajouter un équipement</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}