"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const statuses = ["En service", "En stock", "En maintenance", "Réformé"];

export default function EquipmentStatusChart() {
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipmentStatus() {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipements')
        .select('statut');

      if (error) {
        console.error("Error fetching equipment statuses:", error);
        setLoading(false);
        return;
      }

      const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {} as Record<string, number>);

      data.forEach(item => {
        if (item.statut && statusCounts.hasOwnProperty(item.statut)) {
          statusCounts[item.statut]++;
        }
      });

      const formattedData = Object.entries(statusCounts).map(([name, total]) => ({
        name,
        total,
      }));

      setChartData(formattedData);
      setLoading(false);
    }

    fetchEquipmentStatus();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Équipements par Statut</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground h-[350px] flex items-center justify-center">Chargement des données du graphique...</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc', borderRadius: '0.5rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="total" fill="#ef4444" name="Nombre d'équipements" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}