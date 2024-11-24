import React from 'react';

interface StatCard {
  title: string;
  value: number | string;
  change: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface AdminStatsProps {
  stats: StatCard[];
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.change.includes('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} από τον προηγούμενο μήνα
              </p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}