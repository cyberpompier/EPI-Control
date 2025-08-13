import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'red' | 'green' | 'yellow' | 'blue';
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  color = 'default'
}: StatCardProps) {
  const colorClasses = {
    default: 'bg-white',
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  const iconColorClasses = {
    default: 'text-gray-500',
    red: 'text-red-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    blue: 'text-blue-500',
  };

  return (
    <Card className={`${colorClasses[color]} border shadow-sm`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`${iconColorClasses[color]} p-2 rounded-full bg-opacity-10`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-1">par rapport au mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}