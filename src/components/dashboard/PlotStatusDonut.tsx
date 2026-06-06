'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlotStatusDonutProps {
  available: number;
  booked: number;
  sold: number;
}

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

export default function PlotStatusDonut({ available, booked, sold }: PlotStatusDonutProps) {
  const data = [
    { name: 'Available', value: available },
    { name: 'Booked', value: booked },
    { name: 'Sold', value: sold },
  ].filter((item) => item.value > 0);

  const total = available + booked + sold;

  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold text-gray-900">Plot Status</h2>
      <p className="mt-1 text-sm text-gray-500">{total} total plots</p>
      <div className="mt-4 h-64">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No plot data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [Number(value ?? 0), 'Plots']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
