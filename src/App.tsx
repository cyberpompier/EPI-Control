import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Equipements from "./pages/Equipements";
import EquipementForm from "./pages/EquipementForm";
import Controles from "./pages/Controles";
import Personnel from "./pages/Personnel";
import PersonnelForm from "./pages/PersonnelForm";
import PersonnelDetail from "./pages/PersonnelDetail";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ControleDetail from "./pages/ControleDetail";
import ControleForm from "./pages/ControleForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);

      // Écouter les changements d'authentification
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkSession();
  }, []);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    if (!session) window.location.href = "/login";
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/equipements" element={<ProtectedRoute><Equipements /></ProtectedRoute>} />
            <Route path="/equipements/nouveau" element={<ProtectedRoute><EquipementForm /></ProtectedRoute>} />
            <Route path="/controles" element={<ProtectedRoute><Controles /></ProtectedRoute>} />
            <Route path="/controles/:id" element={<ProtectedRoute><ControleDetail /></ProtectedRoute>} />
            <Route path="/controle/:id" element={<ProtectedRoute><ControleForm /></ProtectedRoute>} />
            <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
            <Route path="/personnel/nouveau" element={<ProtectedRoute><PersonnelForm /></ProtectedRoute>} />
            <Route path="/personnel/:id" element={<ProtectedRoute><PersonnelDetail /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;