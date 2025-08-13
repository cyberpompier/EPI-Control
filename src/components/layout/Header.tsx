import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { showSuccess } from '@/utils/toast';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showSuccess('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <header className="bg-red-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo-pompier.svg" alt="Logo Pompiers" className="h-10 w-10" />
          <span className="font-bold text-xl">EPI Control</span>
        </Link>

        {isMobile ? (
          <>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-red-700 z-50 shadow-lg">
                <nav className="flex flex-col p-4">
                  <Link to="/dashboard" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Tableau de bord
                  </Link>
                  <Link to="/controles" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Contrôles
                  </Link>
                  <Link to="/equipements" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Équipements
                  </Link>
                  <Link to="/personnel" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Personnel
                  </Link>
                  <Link to="/notifications" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Notifications
                  </Link>
                  <Link to="/profile" className="py-2 px-4 hover:bg-red-800 rounded" onClick={() => setIsMenuOpen(false)}>
                    Mon profil
                  </Link>
                  <Button variant="ghost" className="justify-start py-2 px-4 hover:bg-red-800 rounded text-white" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                  </Button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard" className="hover:text-gray-200">Tableau de bord</Link>
              <Link to="/controles" className="hover:text-gray-200">Contrôles</Link>
              <Link to="/equipements" className="hover:text-gray-200">Équipements</Link>
              <Link to="/personnel" className="hover:text-gray-200">Personnel</Link>
            </nav>
            
            <Link to="/notifications" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="flex items-center hover:text-gray-200">
                <User size={20} className="mr-1" />
                <span>{user?.email?.split('@')[0] || 'Utilisateur'}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-gray-200">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}