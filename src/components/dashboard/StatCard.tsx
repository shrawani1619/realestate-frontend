import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  change: string;
  changePositive?: boolean;
}

export default function StatCard({ label, value, icon, change, changePositive = true }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          {icon}
        </div>
        <span
          className={`text-xs font-medium ${
            changePositive ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {change}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
