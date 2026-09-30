import React from 'react';
import { TrendingUp, User, Users, Star } from 'lucide-react';
import type { PlatformKpiItem } from '../../data/adminData';

interface Props {
  items: PlatformKpiItem[];
}

export const AdminPlatformKpiCards: React.FC<Props> = ({ items }) => {
  const getIconData = (type: PlatformKpiItem['iconType']) => {
    switch (type) {
      case 'student':
        return {
          icon: TrendingUp,
          bgColor: 'bg-amber-50 dark:bg-amber-950/60',
          iconColor: 'text-[#ff8a00] dark:text-[#f97316]',
        };
      case 'teacher':
        return {
          icon: User,
          bgColor: 'bg-blue-50 dark:bg-blue-950/60',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'parent':
        return {
          icon: Users,
          bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'course':
        return {
          icon: Star,
          bgColor: 'bg-amber-50 dark:bg-amber-950/60',
          iconColor: 'text-[#ff8a00] dark:text-[#f97316]',
        };
      default:
        return {
          icon: TrendingUp,
          bgColor: 'bg-amber-50 dark:bg-amber-950/60',
          iconColor: 'text-[#ff8a00] dark:text-[#f97316]',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {items.map((item) => {
        const { icon: Icon, bgColor, iconColor } = getIconData(item.iconType);

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-[#18181b] rounded-2xl p-6 border border-gray-200/70 dark:border-[#27272f] shadow-xs flex flex-col justify-between transition-colors"
          >
            {/* Top Row: Icon + 2-line Label */}
            <div className="flex items-center space-x-3.5 mb-4">
              <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor} stroke-[2.2]`} />
              </div>
              <span className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase leading-tight">
                {item.title.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>

            {/* Main Value & Subtext */}
            <div>
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {item.value}{item.unit || ''}
              </div>

              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center space-x-1">
                <span>↑ {item.growth}%</span>
                <span className="text-gray-400 dark:text-gray-500 font-medium">vs last 30 days</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
