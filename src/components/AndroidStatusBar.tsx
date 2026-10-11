import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-md text-slate-300 px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold tracking-tight border-b border-slate-900/60 select-none z-40 sticky top-0">
      {/* Left: Clock */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-slate-200">{timeStr || '10:45'}</span>
      </div>

      {/* Center: Camera notch / punch hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner"></div>

      {/* Right: Android Status Icons */}
      <div className="flex items-center gap-2.5 text-slate-300">
        <span className="text-[10px] tracking-wider font-mono text-teal-400 font-bold">5G</span>
        <Signal className="w-3 h-3 text-slate-300" />
        <Wifi className="w-3 h-3 text-slate-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono text-slate-300">89%</span>
          <BatteryMedium className="w-3.5 h-3.5 text-teal-400 rotate-90" />
        </div>
      </div>
    </div>
  );
};
