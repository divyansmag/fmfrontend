import React from 'react';
import { Server, Database, ShieldCheck, Bell } from 'lucide-react';
import type { SystemStatusItem } from '../../data/adminData';

interface Props {
  statuses: SystemStatusItem[];
}

export const SystemStatusCard: React.FC<Props> = ({ statuses }) => {
  const getIcon = (service: string) => {
    switch (service) {
      case 'Platform':
        return <Server className="w-4 h-4 text-gray-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-gray-400" />;
      case 'Authentication':
        return <ShieldCheck className="w-4 h-4 text-gray-400" />;
      case 'Notifications':
        return <Bell className="w-4 h-4 text-gray-400" />;
      default:
        return <Server className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors h-full">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
          System Status
        </h3>

        <div className="space-y-4">
          {statuses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-[#27272f] last:border-0"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 flex-shrink-0">{getIcon(item.service)}</div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                    {item.service}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap ml-3">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
