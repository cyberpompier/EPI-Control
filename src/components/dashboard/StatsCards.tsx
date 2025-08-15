import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Wrench, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StatsCards() {
  const [stats, setStats] = useState({
    equipements: 0,
    personnel: 0,
    maintenance: 0,
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

        const { count: personnelCount } = await supabase
          .from('personnel')
          .select('*', { count: 'exact', head: true });

        const { count: maintenanceCount } = await supabase
          .from('equipements')
          .select('*', { count: 'exact', head: true })
          .eq('statut', 'En maintenance');
        
        const { count: controlesCount } = await supabase
          .from('controles')
          .select('*', { count: 'exact', head: true });

        setStats({
          equipements: equipementsCount || 0,
          personnel: personnelCount || 0,
          maintenance: maintenanceCount || 0,
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
    { title: "Équipements Total", value: stats.equipements, icon: Shield, color: "text-blue-500" },
    { title: "Personnel", value: stats.personnel, icon: Users, color: "text-green-500" },
    { title: "En Maintenance", value: stats.maintenance, icon: Wrench, color: "text-yellow-500" },
    { title: "Contrôles Réalisés", value: stats.controles, icon: ClipboardList, color: "text-red-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold">{item.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}