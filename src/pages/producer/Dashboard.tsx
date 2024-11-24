import React from 'react';
import { DashboardStats } from '../../components/producer/DashboardStats';
import { RevenueChart } from '../../components/producer/RevenueChart';
import { Notifications } from '../../components/producer/Notifications';
import { HelpCenter } from '../../components/producer/HelpCenter';

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Πίνακας Ελέγχου</h1>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <Notifications />
      </div>

      <HelpCenter />
    </div>
  );
}

export default Dashboard;