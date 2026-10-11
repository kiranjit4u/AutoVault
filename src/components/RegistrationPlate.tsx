import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { FuelType } from '../types/vehicle';

interface Props {
  plateNumber: string;
  fuelType?: FuelType;
  size?: 'sm' | 'md' | 'lg';
  allowCopy?: boolean;
}

export const RegistrationPlate: React.FC<Props> = ({
  plateNumber,
  fuelType = 'Petrol',
  size = 'md',
  allowCopy = true,
}) => {
  const [copied, setCopied] = useState(false);

  const isEV = fuelType === 'Electric';
  const isCommercial = false;

  // Plate styling according to vehicle norms
  // EV: Green background with white letters
  // Private: White background with black letters
  // Commercial: Yellow background with black letters
  const bgClass = isEV
    ? 'bg-emerald-700 text-white border-emerald-600'
    : isCommercial
    ? 'bg-amber-300 text-slate-950 border-amber-400 font-bold'
    : 'bg-neutral-100 text-slate-950 border-neutral-300 font-bold';

  const indStripClass = isEV
    ? 'bg-emerald-900 text-emerald-200'
    : 'bg-blue-800 text-white';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allowCopy) return;
    navigator.clipboard.writeText(plateNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2 tracking-wider',
    md: 'text-sm py-1 px-3 tracking-widest',
    lg: 'text-base py-1.5 px-4 tracking-widest font-extrabold',
  }[size];

  return (
    <div
      onClick={handleCopy}
      className={`inline-flex items-center rounded-lg border-2 shadow-sm font-mono select-all transition ${
        allowCopy ? 'cursor-pointer hover:shadow-md active:scale-98' : ''
      } ${bgClass}`}
      title={allowCopy ? 'Click to copy plate number' : undefined}
    >
      {/* IND Strip */}
      <div className={`flex flex-col items-center justify-center px-1.5 py-0.5 border-r border-black/10 self-stretch ${indStripClass} rounded-l-[4px]`}>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-0.5"></div>
        <span className="text-[8px] font-black tracking-tighter leading-none">IND</span>
      </div>

      {/* Registration text */}
      <span className={`font-mono font-black uppercase ${sizeClasses}`}>
        {plateNumber}
      </span>

      {/* Copy feedback icon */}
      {allowCopy && (
        <span className="pl-1 pr-1.5 opacity-60 hover:opacity-100 transition">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
          ) : (
            <Copy className="w-3 h-3 text-slate-600" />
          )}
        </span>
      )}
    </div>
  );
};
