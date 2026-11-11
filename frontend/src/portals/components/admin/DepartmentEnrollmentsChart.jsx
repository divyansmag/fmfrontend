import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { BookOpen, Layers } from 'lucide-react';

export const DepartmentEnrollmentsChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Department Enrollments vs Capacity</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              Active student intake across key curriculum streams
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Avg 85% Full
            </span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
              <XAxis
                dataKey="subject"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 space-y-1">
                        <div className="font-bold text-[#ff8a00]">{item.subject}</div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Enrolled:</span>
                          <span className="font-bold text-white">{item.enrolled}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <span>Capacity:</span>
                          <span className="font-bold text-white">{item.capacity}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400 font-semibold border-t border-slate-700/80 pt-1">
                          <span>Completion Rate:</span>
                          <span>{item.completionRate}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="enrolled"
                name="Enrolled Students"
                fill="#ff8a00"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="capacity"
                name="Max Capacity"
                fill="#cbd5e1"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
                className="opacity-40 dark:opacity-20"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Summary Cards */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ff8a00]"></span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Enrolled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600"></span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Target Capacity</span>
          </div>
        </div>
        <span className="font-bold text-slate-900 dark:text-white">1,585 total slots filled</span>
      </div>
    </div>
  );
};
