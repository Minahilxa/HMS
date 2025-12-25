
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant: 'sky' | 'purple' | 'red' | 'green';
  onClick?: () => void;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, variant, onClick, trend }) => {
  const variantClasses = {
    sky: 'bg-sky-50 text-sky-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${variantClasses[variant]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
