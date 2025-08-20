import React from 'react';
import Layout from '@/components/layout/Layout';
import StatsCards from '@/components/dashboard/StatsCards';
import EquipmentStatusChart from '@/components/dashboard/EquipmentStatusChart';
import RecentControls from '@/components/dashboard/RecentControls';
import { PersonnelList } from '@/components/dashboard/PersonnelList';

export default function Dashboard() {
  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        
        <StatsCards />
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentControls />
          </div>
          <div>
            <PersonnelList />
          </div>
        </div>
        
        <EquipmentStatusChart />
      </div>
    </Layout>
  );
}