import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Users, User, GraduationCap, ShieldCheck } from 'lucide-react';

export const UserDemographicsChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalUsers = data.reduce((acc, curr) => acc + curr.value, 0);

  const renderTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg border border-slate-700">
          <div className="font-bold flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.fill }}
            />
            <span>{item.name}</span>
          </div>
          <div className="mt-1 text-slate-300">
            <span className="font-extrabold text-white">{item.value.toLocaleString()}</span> active accounts ({item.percentage})
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>User Distribution</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-[#ff8a00] border border-amber-200/60 dark:border-amber-900/40">
            {totalUsers.toLocaleString()} Total
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-4">
          Breakdown across students, parents, and educators
        </p>

        {/* Donut Chart Container */}
        <div className="w-full h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="transition-all duration-300 cursor-pointer outline-none"
                    stroke={activeIndex === index ? '#ffffff' : 'transparent'}
                    strokeWidth={2}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.65}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-gray-900 dark:text-white font-display">
              100%
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Legend Stats Bar */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/60">
        {data.map((item) => (
          <div
            key={item.name}
            className="p-2.5 rounded-xl bg-gray-50/70 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 text-center flex flex-col items-center"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate">{item.name}</span>
            </div>
            <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">
              {item.value}
            </div>
            <div className="text-[10px] font-semibold text-gray-400">
              {item.percentage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
