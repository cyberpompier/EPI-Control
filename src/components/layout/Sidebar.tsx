import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Shield, Users, ClipboardList, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-red-700 text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b">
        <Shield className="h-8 w-8 text-red-600" />
        <span className="ml-3 text-xl font-bold text-gray-800">EPI Control</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink to="/" end className={navLinkClasses}>
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/equipements" className={navLinkClasses}>
          <Shield className="h-5 w-5 mr-3" />
          Équipements
        </NavLink>
        <NavLink to="/personnel" className={navLinkClasses}>
          <Users className="h-5 w-5 mr-3" />
          Personnel
        </NavLink>
        <NavLink to="/controles" className={navLinkClasses}>
          <ClipboardList className="h-5 w-5 mr-3" />
          Contrôles
        </NavLink>
      </nav>
      <div className="px-4 py-6 mt-auto">
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;