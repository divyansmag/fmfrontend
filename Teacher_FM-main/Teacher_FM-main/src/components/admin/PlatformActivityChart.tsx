import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { ActivityChartPoint } from '../../data/adminData';

interface Props {
  data: ActivityChartPoint[];
}

export const PlatformActivityChart: React.FC<Props> = ({ data }) => {
  const [timeRange, setTimeRange] = useState('Last 6 Weeks');

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Platform Activity Overview
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            Track engagement across the FutureMinds platform
          </p>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => {
              const ranges = ['Last 4 Weeks', 'Last 6 Weeks', 'Last 3 Months'];
              const idx = ranges.indexOf(timeRange);
              setTimeRange(ranges[(idx + 1) % ranges.length]);
            }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#27272f] bg-white dark:bg-[#101014] text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1f1f27] transition-colors cursor-pointer"
          >
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="adminActivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff8a00" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ff8a00" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              domain={[20, 100]}
              hide={true}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md font-semibold">
                      {`${payload[0].payload.week}: ${payload[0].value}% activity`}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="activity"
              stroke="#ff8a00"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#adminActivityGradient)"
              dot={{
                r: 5,
                fill: '#ffffff',
                stroke: '#ff8a00',
                strokeWidth: 3,
              }}
              activeDot={{
                r: 7,
                fill: '#ff8a00',
                stroke: '#ffffff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
