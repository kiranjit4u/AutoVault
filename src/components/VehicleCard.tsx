import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { RegistrationPlate } from './RegistrationPlate';
import { getDaysRemaining } from '../services/notifications';
import {
  Car,
  Bike,
  Truck,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  ChevronRight,
  Edit2,
  Trash2,
  FileCheck2,
  Wrench,
} from 'lucide-react';

interface Props {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onQuickLogPressure: (vehicle: Vehicle) => void;
  onRenewPUC: (vehicle: Vehicle) => void;
  onRenewInsurance: (vehicle: Vehicle) => void;
  onAddService?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<Props> = ({
  vehicle,
  onSelect,
  onEdit,
  onDelete,
  onQuickLogPressure,
  onRenewPUC,
  onRenewInsurance,
  onAddService,
}) => {
  const [copiedChassis, setCopiedChassis] = useState(false);
  const [copiedEngine, setCopiedEngine] = useState(false);

  const pucDays = getDaysRemaining(vehicle.puc.expiryDate);
  const insuranceDays = getDaysRemaining(vehicle.insurance.expiryDate);

  const isPUCCritical = pucDays <= 5 && pucDays >= 0;
  const isPUCExpired = pucDays < 0;

  const isInsuranceCritical = insuranceDays <= 7 && insuranceDays >= 0;
  const isInsuranceExpired = insuranceDays < 0;

  const handleCopyChassis = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(vehicle.chassisNumber);
    setCopiedChassis(true);
    setTimeout(() => setCopiedChassis(false), 2000);
  };

  const handleCopyEngine = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(vehicle.engineNumber);
    setCopiedEngine(true);
    setTimeout(() => setCopiedEngine(false), 2000);
  };

  const getTypeIcon = () => {
    switch (vehicle.type) {
      case 'motorcycle':
      case 'scooter':
        return <Bike className="w-5 h-5 text-teal-400" />;
      case 'commercial':
        return <Truck className="w-5 h-5 text-amber-400" />;
      default:
        return <Car className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isPUCCritical || isPUCExpired
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20'
          : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md shadow-black/40'
      }`}
    >
      {/* 5-Day PUC Expiry Top Banner if applicable */}
      {isPUCCritical && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 bg-[length:200%_auto] text-slate-950 px-3.5 py-1.5 flex items-center justify-between text-xs font-black tracking-wide uppercase animate-pulse">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            <span>PUC EXPIRES IN {pucDays === 0 ? 'TODAY' : `${pucDays} DAYS`}!</span>
          </div>
          <span className="text-[11px] underline font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); onRenewPUC(vehicle); }}>
            Renew Now →
          </span>
        </div>
      )}

      {isPUCExpired && (
        <div className="bg-rose-600 text-white px-3.5 py-1.5 flex items-center justify-between text-xs font-black tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            <span>PUC EXPIRED ({Math.abs(pucDays)} DAYS AGO)</span>
          </div>
          <span className="text-[11px] underline font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); onRenewPUC(vehicle); }}>
            Update Certificate →
          </span>
        </div>
      )}

      {/* Insurance Expiration Banner if PUC is safe but Insurance is expiring */}
      {!isPUCCritical && !isPUCExpired && isInsuranceCritical && (
        <div className="bg-gradient-to-r from-teal-500 via-sky-500 to-teal-500 bg-[length:200%_auto] text-slate-950 px-3.5 py-1.5 flex items-center justify-between text-xs font-black tracking-wide uppercase animate-pulse">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>INSURANCE EXPIRES IN {insuranceDays === 0 ? 'TODAY' : `${insuranceDays} DAYS`}!</span>
          </div>
          <span className="text-[11px] underline font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); onRenewInsurance(vehicle); }}>
            Renew Policy →
          </span>
        </div>
      )}

      {!isPUCCritical && !isPUCExpired && isInsuranceExpired && (
        <div className="bg-rose-700 text-white px-3.5 py-1.5 flex items-center justify-between text-xs font-black tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>INSURANCE EXPIRED ({Math.abs(insuranceDays)} DAYS AGO)</span>
          </div>
          <span className="text-[11px] underline font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); onRenewInsurance(vehicle); }}>
            Renew Policy →
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Header: Title, Vehicle Type, and Quick Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
              {getTypeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight leading-snug">
                  {vehicle.nickname}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {vehicle.fuelType}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {vehicle.make} {vehicle.model} • {vehicle.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(vehicle);
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Edit Vehicle Details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Remove ${vehicle.nickname} (${vehicle.registrationNumber}) from garage?`)) {
                  onDelete(vehicle.id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              title="Delete Vehicle"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Number Plate display */}
        <div className="mt-3.5 flex items-center justify-between">
          <RegistrationPlate
            plateNumber={vehicle.registrationNumber}
            fuelType={vehicle.fuelType}
            size="md"
          />

          <span className="text-xs font-medium text-teal-400 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
            Details <ChevronRight className="w-4 h-4" />
          </span>
        </div>

        {/* Chassis No & Engine No chips with quick copy */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Chassis / VIN */}
          <div
            onClick={handleCopyChassis}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
            title="Click to copy Chassis Number (VIN)"
          >
            <div className="min-w-0 pr-2">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Chassis No (VIN)
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                {vehicle.chassisNumber || 'Not entered'}
              </div>
            </div>
            <div className="shrink-0 text-slate-400">
              {copiedChassis ? (
                <Check className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 hover:text-white" />
              )}
            </div>
          </div>

          {/* Engine No */}
          <div
            onClick={handleCopyEngine}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
            title="Click to copy Engine Number"
          >
            <div className="min-w-0 pr-2">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Engine No
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                {vehicle.engineNumber || 'Not entered'}
              </div>
            </div>
            <div className="shrink-0 text-slate-400">
              {copiedEngine ? (
                <Check className="w-3.5 h-3.5 text-teal-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 hover:text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Key Status Grid: PUC, Insurance, Tyre Pressure */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2">
          {/* PUC Status */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onRenewPUC(vehicle);
            }}
            className={`p-2 rounded-xl border text-center transition flex flex-col justify-between ${
              isPUCExpired
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : isPUCCritical
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-slate-950/40 border-slate-800/80 text-emerald-400'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <FileCheck2 className="w-3 h-3" />
              <span>PUC</span>
            </div>
            <div className="text-xs font-bold mt-1 leading-tight">
              {isPUCExpired
                ? 'Expired'
                : isPUCCritical
                ? `${pucDays}d left`
                : `${pucDays}d valid`}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 truncate">
              {vehicle.puc.expiryDate}
            </div>
          </div>

          {/* Insurance Status */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onRenewInsurance(vehicle);
            }}
            className={`p-2 rounded-xl border text-center transition flex flex-col justify-between cursor-pointer ${
              insuranceDays < 0
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : insuranceDays <= 7
                ? 'bg-teal-950/40 border-teal-500/50 text-teal-300'
                : 'bg-slate-950/40 border-slate-800/80 text-teal-400'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Insurance</span>
            </div>
            <div className="text-xs font-bold mt-1 leading-tight">
              {insuranceDays < 0
                ? 'Expired'
                : insuranceDays <= 7
                ? `${insuranceDays}d left`
                : 'Active'}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 truncate">
              {vehicle.insurance.expiryDate}
            </div>
          </div>

          {/* Tyre Pressure Status */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onQuickLogPressure(vehicle);
            }}
            className="p-2 rounded-xl border border-slate-800/80 bg-slate-950/40 text-center hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-cyan-400" />
              <span>Pressure</span>
            </div>
            <div className="text-xs font-bold text-slate-200 mt-1 leading-tight font-mono">
              {vehicle.type === 'motorcycle' || vehicle.type === 'scooter'
                ? `${vehicle.tyrePressure.currentFrontLeft}/${vehicle.tyrePressure.currentRearLeft} PSI`
                : `${vehicle.tyrePressure.currentFrontLeft}/${vehicle.tyrePressure.currentRearLeft} PSI`}
            </div>
            <div className="text-[9px] text-teal-400 hover:underline mt-0.5">
              Check/Log
            </div>
          </div>
        </div>

        {/* Maintenance / Service history quick glance */}
        <div
          onClick={(e) => {
            if (onAddService) {
              e.stopPropagation();
              onAddService(vehicle);
            }
          }}
          className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 cursor-pointer hover:text-slate-200 transition group/service"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover/service:rotate-12 transition-transform" />
            <span className="truncate">
              Service: <strong className="text-slate-300 font-normal">{vehicle.serviceHistory?.[0]?.title || 'Scheduled'}</strong>
            </span>
          </div>
          <span className="text-teal-400 font-mono text-[10px] font-semibold shrink-0 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 group-hover/service:bg-teal-500/20 transition flex items-center gap-1">
            <span>+</span> {vehicle.serviceHistory?.length ? `${vehicle.serviceHistory.length} logs` : 'Log service'}
          </span>
        </div>
      </div>
    </div>
  );
};
