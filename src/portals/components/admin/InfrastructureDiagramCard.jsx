import React from 'react';
import { Server, Cpu, HardDrive, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';

export const InfrastructureDiagramCard = ({ metrics, services }) => {
  const getIcon = (metric) => {
    switch (metric) {
      case 'API Response':
        return <Wifi className="w-4 h-4 text-emerald-500" />;
      case 'Database Load':
        return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'Storage Utilized':
        return <HardDrive className="w-4 h-4 text-purple-500" />;
      default:
        return <Server className="w-4 h-4 text-[#ff8a00]" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200/70 dark:border-slate-700/80 shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Platform Health & Infrastructure</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              Live server cluster status, microservices topology & system telemetry
            </p>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            99.98% Uptime
          </span>
        </div>

        {/* Telemetry Gauge Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {metrics.map((item) => (
            <div
              key={item.metric}
              className="p-3 rounded-xl bg-gray-50/70 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate">
                  {item.metric}
                </span>
                {getIcon(item.metric)}
              </div>
              <div>
                <div className="text-lg font-black text-gray-900 dark:text-white font-display">
                  {item.value}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  <span>Target: {item.target}</span>
                  <span className="text-emerald-500 font-bold">Good</span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Architecture & Services Topology Diagram */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
            <span className="uppercase tracking-wider text-[10px] text-gray-400 font-extrabold">
              Microservices Cluster Architecture
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All 4 Nodes Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {services.map((srv, index) => (
              <div
                key={srv.id}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 flex items-center justify-between shadow-2xs hover:border-[#ff8a00]/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#ff8a00] flex items-center justify-center font-bold text-xs">
                    0{index + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {srv.service}
                    </h5>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                      {srv.status}
                    </p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
