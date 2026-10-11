import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { RegistrationPlate } from './RegistrationPlate';
import {
  Gauge,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface Props {
  vehicles: Vehicle[];
  onLogPressure: (vehicle: Vehicle) => void;
}

export const TyrePressureStation: React.FC<Props> = ({
  vehicles,
  onLogPressure,
}) => {
  const [selectedId, setSelectedId] = useState<string>(vehicles[0]?.id || '');
  const vehicle = vehicles.find((v) => v.id === selectedId) || vehicles[0];

  if (!vehicle) {
    return (
      <div className="p-8 text-center text-slate-400">
        No vehicles found. Add a vehicle first to monitor tyre pressure.
      </div>
    );
  }

  const isTwoWheeler = vehicle.type === 'motorcycle' || vehicle.type === 'scooter';
  const recFront = vehicle.tyrePressure.recommendedFront || 32;
  const recRear = vehicle.tyrePressure.recommendedRear || 35;

  const getStatus = (current: number, target: number) => {
    const diff = current - target;
    if (Math.abs(diff) <= 1) {
      return { label: 'Optimal', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30', ok: true };
    }
    if (diff < -3) {
      return { label: 'Low', color: 'text-rose-400 border-rose-500/50 bg-rose-950/30', ok: false };
    }
    if (diff < 0) {
      return { label: 'Slightly Low', color: 'text-amber-400 border-amber-500/50 bg-amber-950/30', ok: false };
    }
    return { label: 'High', color: 'text-sky-400 border-sky-500/50 bg-sky-950/30', ok: false };
  };

  const flStatus = getStatus(vehicle.tyrePressure.currentFrontLeft, recFront);
  const frStatus = getStatus(vehicle.tyrePressure.currentFrontRight, recFront);
  const rlStatus = getStatus(vehicle.tyrePressure.currentRearLeft, recRear);
  const rrStatus = getStatus(vehicle.tyrePressure.currentRearRight, recRear);

  return (
    <div className="space-y-5 pb-24">
      {/* Vehicle Switcher Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedId(v.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              v.id === vehicle.id
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{v.nickname}</span>
            <span className="font-mono text-[10px] opacity-80">({v.registrationNumber})</span>
          </button>
        ))}
      </div>

      {/* Main Tyre Pressure Station Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                {vehicle.nickname} Tyre Station
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                {isTwoWheeler ? '2-Wheeler' : '4-Wheeler'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <strong className="text-slate-200">{recFront} PSI Front</strong> /{' '}
              <strong className="text-slate-200">{recRear} PSI Rear</strong> • Interval: Every {vehicle.tyrePressure.checkIntervalDays || 14} days
            </p>
          </div>

          <button
            onClick={() => onLogPressure(vehicle)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-md shadow-teal-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Log Check</span>
          </button>
        </div>

        {/* Visual Chassis & Tyre Layout */}
        <div className="relative py-6 px-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center">
          {isTwoWheeler ? (
            /* Two Wheeler Layout */
            <div className="w-full max-w-xs space-y-6 flex flex-col items-center">
              {/* Front Wheel */}
              <div className={`w-full p-4 rounded-2xl border text-center transition ${flStatus.color}`}>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Front Tyre
                </div>
                <div className="text-3xl font-black font-mono mt-1">
                  {vehicle.tyrePressure.currentFrontLeft}{' '}
                  <span className="text-xs font-sans font-medium text-slate-400">PSI</span>
                </div>
                <div className="text-xs font-semibold mt-1">{flStatus.label} (Target {recFront})</div>
              </div>

              {/* Bike Body graphic */}
              <div className="w-2.5 h-20 bg-slate-800 rounded-full flex flex-col items-center justify-between py-2 border border-slate-700">
                <div className="w-6 h-1 bg-cyan-400 rounded-full"></div>
                <div className="w-4 h-4 rounded-full bg-teal-500/40 border border-teal-400"></div>
                <div className="w-6 h-1 bg-cyan-400 rounded-full"></div>
              </div>

              {/* Rear Wheel */}
              <div className={`w-full p-4 rounded-2xl border text-center transition ${rlStatus.color}`}>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Rear Tyre
                </div>
                <div className="text-3xl font-black font-mono mt-1">
                  {vehicle.tyrePressure.currentRearLeft}{' '}
                  <span className="text-xs font-sans font-medium text-slate-400">PSI</span>
                </div>
                <div className="text-xs font-semibold mt-1">{rlStatus.label} (Target {recRear})</div>
              </div>
            </div>
          ) : (
            /* 4-Wheeler Car Layout */
            <div className="w-full max-w-md">
              <div className="grid grid-cols-2 gap-4">
                {/* Front Left */}
                <div className={`p-3.5 rounded-2xl border text-center transition ${flStatus.color}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Front Left (FL)
                  </div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {vehicle.tyrePressure.currentFrontLeft}{' '}
                    <span className="text-[10px] font-sans font-medium text-slate-400">PSI</span>
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5">{flStatus.label}</div>
                </div>

                {/* Front Right */}
                <div className={`p-3.5 rounded-2xl border text-center transition ${frStatus.color}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Front Right (FR)
                  </div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {vehicle.tyrePressure.currentFrontRight}{' '}
                    <span className="text-[10px] font-sans font-medium text-slate-400">PSI</span>
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5">{frStatus.label}</div>
                </div>
              </div>

              {/* Car Body representation */}
              <div className="my-3 py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-center flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                  Front Axle ({recFront} PSI)
                </span>
                <span className="text-[10px] text-slate-400">
                  Last Checked: {vehicle.tyrePressure.lastCheckedDate}
                </span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                  Rear Axle ({recRear} PSI)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rear Left */}
                <div className={`p-3.5 rounded-2xl border text-center transition ${rlStatus.color}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Rear Left (RL)
                  </div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {vehicle.tyrePressure.currentRearLeft}{' '}
                    <span className="text-[10px] font-sans font-medium text-slate-400">PSI</span>
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5">{rlStatus.label}</div>
                </div>

                {/* Rear Right */}
                <div className={`p-3.5 rounded-2xl border text-center transition ${rrStatus.color}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Rear Right (RR)
                  </div>
                  <div className="text-2xl font-black font-mono mt-1">
                    {vehicle.tyrePressure.currentRearRight}{' '}
                    <span className="text-[10px] font-sans font-medium text-slate-400">PSI</span>
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5">{rrStatus.label}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History Log */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Inspection History
            </h3>
            <span className="text-[11px] text-slate-400">
              {vehicle.tyrePressure.logs?.length || 0} Records
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {vehicle.tyrePressure.logs && vehicle.tyrePressure.logs.length > 0 ? (
              vehicle.tyrePressure.logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-mono text-slate-300 text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{log.timestamp}</span>
                    </div>
                    {log.notes && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.notes}</p>
                    )}
                  </div>
                  <div className="text-right font-mono font-bold text-teal-300">
                    {isTwoWheeler
                      ? `${log.frontLeft} / ${log.rearLeft} PSI`
                      : `${log.frontLeft} / ${log.frontRight} / ${log.rearLeft} / ${log.rearRight} PSI`}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 p-3 text-center">No logs recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
