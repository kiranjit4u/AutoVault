import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { getTodayString } from '../services/db';
import { X, Gauge, Check, Plus, Minus } from 'lucide-react';

interface Props {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePressure: (vehicleId: string, updatedConfig: Vehicle['tyrePressure']) => void;
}

export const QuickLogPressureModal: React.FC<Props> = ({
  vehicle,
  isOpen,
  onClose,
  onSavePressure,
}) => {
  if (!isOpen || !vehicle) return null;

  const isTwoWheeler = vehicle.type === 'motorcycle' || vehicle.type === 'scooter';
  const recFront = vehicle.tyrePressure.recommendedFront || 32;
  const recRear = vehicle.tyrePressure.recommendedRear || 35;

  const [fl, setFl] = useState(vehicle.tyrePressure.currentFrontLeft || recFront);
  const [fr, setFr] = useState(vehicle.tyrePressure.currentFrontRight || recFront);
  const [rl, setRl] = useState(vehicle.tyrePressure.currentRearLeft || recRear);
  const [rr, setRr] = useState(vehicle.tyrePressure.currentRearRight || recRear);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = getTodayString();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: `${today} ${nowTime}`,
      frontLeft: fl,
      frontRight: isTwoWheeler ? fl : fr,
      rearLeft: rl,
      rearRight: isTwoWheeler ? rl : rr,
      notes: notes.trim() || 'Tyre pressure checked & corrected',
    };

    const updatedConfig: Vehicle['tyrePressure'] = {
      ...vehicle.tyrePressure,
      currentFrontLeft: fl,
      currentFrontRight: isTwoWheeler ? fl : fr,
      currentRearLeft: rl,
      currentRearRight: isTwoWheeler ? rl : rr,
      lastCheckedDate: today,
      logs: [newLog, ...(vehicle.tyrePressure.logs || [])].slice(0, 20),
    };

    onSavePressure(vehicle.id, updatedConfig);
    onClose();
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
    setter((prev) => Math.max(15, Math.min(65, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Log Tyre Pressure Check</h3>
              <p className="text-xs text-slate-400">
                {vehicle.nickname} ({vehicle.registrationNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="text-center text-xs text-slate-400">
            Recommended: <span className="text-white font-mono font-bold">{recFront} PSI Front</span> /{' '}
            <span className="text-white font-mono font-bold">{recRear} PSI Rear</span>
          </div>

          {isTwoWheeler ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Front Tyre */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Front Wheel</span>
                <div className="text-2xl font-black font-mono text-teal-400">{fl} <span className="text-xs text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjust(setFl, -1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjust(setFl, 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rear Tyre */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Rear Wheel</span>
                <div className="text-2xl font-black font-mono text-teal-400">{rl} <span className="text-xs text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjust(setRl, -1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjust(setRl, 1)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {/* Front Left */}
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Front Left (FL)</span>
                <div className="text-xl font-black font-mono text-teal-400">{fl} <span className="text-[10px] text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => adjust(setFl, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => adjust(setFl, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Front Right */}
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Front Right (FR)</span>
                <div className="text-xl font-black font-mono text-teal-400">{fr} <span className="text-[10px] text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => adjust(setFr, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => adjust(setFr, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Rear Left */}
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Rear Left (RL)</span>
                <div className="text-xl font-black font-mono text-teal-400">{rl} <span className="text-[10px] text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => adjust(setRl, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => adjust(setRl, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Rear Right */}
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">Rear Right (RR)</span>
                <div className="text-xl font-black font-mono text-teal-400">{rr} <span className="text-[10px] text-slate-500 font-sans">PSI</span></div>
                <div className="flex items-center justify-center gap-1.5">
                  <button type="button" onClick={() => adjust(setRr, -1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button type="button" onClick={() => adjust(setRr, 1)} className="p-1 rounded bg-slate-800 hover:bg-slate-700">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Station / Check Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Topped up cold tyres at Shell Petrol Pump"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Pressure Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
