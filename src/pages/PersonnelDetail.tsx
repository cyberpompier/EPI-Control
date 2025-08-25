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
import { ArrowLeft, Mail, MapPin, Shield, Plus, Pencil, FileText } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        const { data: pompierData, error: pompierError } = await supabase
          .from('personnel')
          .select('*')
          .eq('id', id)
          .single();
        if (pompierError) throw pompierError;
        setPompier(pompierData);
        setEditedPompier(pompierData);

        const { data: equipementsData, error: equipementsError } = await supabase
          .from('equipements')
          .select('*')
          .eq('personnel_id', id);
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
    setEditedPompier(pompier);
    setIsEditing(false);
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
          matricule: editedPompier.matricule,
          photo: editedPompier.photo
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

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    </Layout>
  );

  if (!pompier) return (
    <Layout>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Pompier non trouvé</h2>
        <p className="text-gray-600 mb-6">Le pompier demandé n'existe pas ou a été supprimé.</p>
        <Link to="/personnel"><Button>Retour au personnel</Button></Link>
      </div>
    </Layout>
  );

  const stats = {
    total: equipements.length,
    conformes: equipements.filter(e => e.statut === 'conforme').length,
    nonConformes: equipements.filter(e => e.statut === 'non_conforme').length,
    enAttente: equipements.filter(e => e.statut === 'en_attente').length
  };

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

  return (
    <Layout>
      <Helmet>
        <title>{pompier.prenom} {pompier.nom} | EPI Control</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Détails du Personnel</h1>
        {!isEditing ? (
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <Link to="/personnel" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au personnel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Carte Personnel */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={editedPompier?.photo || undefined} alt={`${editedPompier?.prenom} ${editedPompier?.nom}`} />
              <AvatarFallback className="text-xl">{getInitials(editedPompier?.nom || '', editedPompier?.prenom || '')}</AvatarFallback>
            </Avatar>

            {isEditing ? (
              <div className="space-y-2">
                <input className="w-full border rounded p-1 text-center" value={editedPompier?.prenom || ''} onChange={e => handleInputChange('prenom', e.target.value)} placeholder="Prénom" />
                <input className="w-full border rounded p-1 text-center" value={editedPompier?.nom || ''} onChange={e => handleInputChange('nom', e.target.value)} placeholder="Nom" />
                <Select value={editedPompier?.grade || ''} onValueChange={value => handleInputChange('grade', value)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un grade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sapeur">Sapeur</SelectItem>
                    <SelectItem value="Caporal">Caporal</SelectItem>
                    <SelectItem value="Caporal-chef">Caporal-chef</SelectItem>
                    <SelectItem value="Sergent">Sergent</SelectItem>
                    <SelectItem value="Sergent-chef">Sergent-chef</SelectItem>
                    <SelectItem value="Adjudant">Adjudant</SelectItem>
                    <SelectItem value="Adjudant-chef">Adjudant-chef</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                    <SelectItem value="Capitaine">Capitaine</SelectItem>
                    <SelectItem value="Commandant">Commandant</SelectItem>
                    <SelectItem value="Lieutenant-colonel">Lieutenant-colonel</SelectItem>
                    <SelectItem value="Colonel">Colonel</SelectItem>
                  </SelectContent>
                </Select>
                <input className="w-full border rounded p-1 text-center" value={editedPompier?.email || ''} onChange={e => handleInputChange('email', e.target.value)} placeholder="Email" />
                <input className="w-full border rounded p-1 text-center" value={editedPompier?.caserne || ''} onChange={e => handleInputChange('caserne', e.target.value)} placeholder="Caserne" />
                <input className="w-full border rounded p-1 text-center" value={editedPompier?.matricule || ''} onChange={e => handleInputChange('matricule', e.target.value)} placeholder="Matricule" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{pompier.prenom} {pompier.nom}</h2>
                <Badge className={`${getGradeColor(pompier.grade || '')} mt-2`} variant="outline">{pompier.grade}</Badge>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-center"><Shield className="h-4 w-4 mr-2 text-gray-500" /> {pompier.matricule}</div>
                  <div className="flex items-center justify-center"><Mail className="h-4 w-4 mr-2 text-gray-500" /> {pompier.email}</div>
                  <div className="flex items-center justify-center"><MapPin className="h-4 w-4 mr-2 text-gray-500" /> {pompier.caserne}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Statistiques EPI */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          {['total', 'conformes', 'nonConformes', 'enAttente'].map((key, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${key === 'conformes' ? 'text-green-600' : key === 'nonConformes' ? 'text-red-600' : key === 'enAttente' ? 'text-yellow-600' : ''}`}>
                  {stats[key as keyof typeof stats]}
                </div>
                <div className="text-sm text-gray-500">{key === 'total' ? 'Total EPI' : key === 'conformes' ? 'Conformes' : key === 'nonConformes' ? 'Non conformes' : 'En attente'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Équipements assignés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Équipements assignés</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" /> Rapport complet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipements.map(epi => <EPICard key={epi.id} epi={epi} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucun équipement assigné</h3>
              <p className="mt-2 text-gray-500 mb-4">Ce pompier n'a pas encore d'équipement assigné.</p>
              <Link to={`/equipements/nouveau?pompier=${pompier.id}`}>
                <Button className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" /> Ajouter un équipement</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
