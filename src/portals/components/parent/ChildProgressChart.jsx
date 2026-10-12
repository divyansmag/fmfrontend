import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { ChevronDown } from 'lucide-react';

const chartData = [
{ week: 'Wk 1', progress: 52 },
{ week: 'Wk 2', progress: 58 },
{ week: 'Wk 3', progress: 66 },
{ week: 'Wk 4', progress: 70 },
{ week: 'Wk 5', progress: 74 },
{ week: 'Wk 6', progress: 78 }];


export const ChildProgressChart = () => {
  const [timeRange, setTimeRange] = useState('Last 6 Weeks');

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Child Progress Overview
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            Track how Ananya is progressing over time.
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
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/50 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1f1f27] transition-colors cursor-pointer">
            
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            
            <defs>
              <linearGradient id="parentProgressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d52ce" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d52ce" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              dy={10} />
            
            <YAxis
              domain={[30, 90]}
              hide={true} />
            

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-md font-semibold">
                      {`${payload[0].payload.week}: ${payload[0].value}%`}
                    </div>);

                }
                return null;
              }} />
            

            <Area
              type="monotone"
              dataKey="progress"
              stroke="#0d52ce"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#parentProgressGradient)"
              dot={{
                r: 5,
                fill: '#ffffff',
                stroke: '#0d52ce',
                strokeWidth: 3
              }}
              activeDot={{
                r: 7,
                fill: '#0d52ce',
                stroke: '#ffffff',
                strokeWidth: 3
              }} />
            
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>);

};