import { Shield, CheckCircle, AlertTriangle, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StatsCards() {
  const [stats, setStats] = useState({
    equipements: 0,
    conformes: 0,
    nonConformes: 0,
    controles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const { count: equipementsCount } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true });

        const { count: conformesCount } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'conforme');

        const { count: nonConformesCount } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'non_conforme');
        
        const { count: controlesCount } = await supabase
          .from('controles')
          .select('*', { count: 'exact', head: true });

        setStats({
          equipements: equipementsCount || 0,
          conformes: conformesCount || 0,
          nonConformes: nonConformesCount || 0,
          controles: controlesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statItems = [
    { title: "Équipements Total", value: stats.equipements, icon: Shield, color: "blue" },
    { title: "Conformes", value: stats.conformes, icon: CheckCircle, color: "green" },
    { title: "Non Conformes", value: stats.nonConformes, icon: AlertTriangle, color: "red" },
    { title: "Contrôles Réalisés", value: stats.controles, icon: ClipboardList, color: "gray" },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <StatCard 
          key={index} 
          title={item.title} 
          value={item.value} 
          icon={item.icon} 
          color={item.color as 'red' | 'green' | 'blue' | 'yellow' | 'gray'} 
        />
      ))}
    </div>
  );
}