import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity, Clock } from 'lucide-react';

export const WeeklyTrafficChart = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Weekly Traffic by Role</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              Multi-role portal logins & interactive sessions over the last 7 days
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
              <Activity className="w-3.5 h-3.5" />
              Peak: Friday (2,015 visits)
            </span>
          </div>
        </div>

        {/* Multi-line chart */}
        <div className="w-full h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
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
                      <div className="bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5">
                        <div className="font-bold text-gray-300 border-b border-slate-700/80 pb-1">
                          {item.day} Breakdown
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <span className="w-2 h-2 rounded-full bg-[#ff8a00]"></span>
                            Students:
                          </span>
                          <span className="font-extrabold">{item.Students}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Parents:
                          </span>
                          <span className="font-extrabold">{item.Parents}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-blue-400">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Teachers:
                          </span>
                          <span className="font-extrabold">{item.Teachers}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="Students"
                stroke="#ff8a00"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ffffff', stroke: '#ff8a00', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#ff8a00', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="Parents"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#ffffff', stroke: '#10b981', strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="Teachers"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-1 rounded-full bg-[#ff8a00]"></span> Students
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-1 rounded-full bg-emerald-500"></span> Parents
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-1 rounded-full bg-blue-500"></span> Teachers
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline-block">
          Updated 5m ago
        </span>
      </div>
    </div>
  );
};
