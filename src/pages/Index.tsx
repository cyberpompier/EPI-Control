import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { supabase } from '@/lib/supabase';
import { Helmet, Shield, CheckCircle, Clock, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>EPI Control | Gestion des équipements de protection</title>
      </Helmet>
      
      <header className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo-pompier.svg" alt="Logo Pompiers" className="h-10 w-10" />
            <span className="font-bold text-xl">EPI Control</span>
          </div>
          <Link to="/login">
            <Button variant="outline" className="text-white border-white hover:bg-red-800">
              Connexion
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-red-700 to-red-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Gestion des Équipements de Protection Individuelle</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Une solution complète pour le contrôle, le suivi et la gestion des EPI des sapeurs-pompiers
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-red-100 text-red-700 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inventaire complet</h3>
                <p className="text-gray-600">
                  Suivez tous vos équipements de protection avec leurs caractéristiques détaillées
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-green-100 text-green-700 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Contrôles simplifiés</h3>
                <p className="text-gray-600">
                  Effectuez et documentez facilement les contrôles périodiques des EPI
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-yellow-100 text-yellow-700 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Alertes et rappels</h3>
                <p className="text-gray-600">
                  Recevez des notifications pour les contrôles à effectuer et les EPI à remplacer
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="bg-blue-100 text-blue-700 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Rapports détaillés</h3>
                <p className="text-gray-600">
                  Générez des rapports PDF pour l'archivage et la traçabilité des contrôles
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://source.unsplash.com/random/600x400?firefighter" 
                  alt="Sapeur-pompier en intervention" 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">La sécurité avant tout</h2>
                <p className="text-lg text-gray-700 mb-4">
                  Les équipements de protection individuelle sont essentiels pour garantir la sécurité des sapeurs-pompiers lors de leurs interventions.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Notre application permet de s'assurer que chaque EPI est conforme aux normes en vigueur et en parfait état de fonctionnement.
                </p>
                <Link to="/login">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Découvrir l'application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-red-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Prêt à améliorer la gestion de vos EPI ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Rejoignez les services d'incendie qui utilisent déjà notre solution pour assurer la sécurité de leurs équipes.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-red-700 hover:bg-gray-100">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <img src="/logo-pompier.svg" alt="Logo Pompiers" className="h-8 w-8" />
                <span className="font-bold text-lg">EPI Control</span>
              </div>
              <p className="text-sm text-gray-400">© 2023 Service Départemental d'Incendie et de Secours</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Mentions légales</a>
              <a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;