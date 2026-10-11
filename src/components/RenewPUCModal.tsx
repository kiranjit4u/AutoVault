import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { getTodayString, getRelativeDateString } from '../services/db';
import { X, FileCheck2, Check, Sparkles } from 'lucide-react';

interface Props {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePUC: (vehicleId: string, updatedPuc: Vehicle['puc']) => void;
}

export const RenewPUCModal: React.FC<Props> = ({
  vehicle,
  isOpen,
  onClose,
  onSavePUC,
}) => {
  if (!isOpen || !vehicle) return null;

  const today = getTodayString();
  const [certNo, setCertNo] = useState(
    vehicle.puc.certificateNumber || `PUC-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [issueDate, setIssueDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState(getRelativeDateString(180)); // 6 months standard
  const [testingCenter, setTestingCenter] = useState(
    vehicle.puc.testingCenter || 'Government Approved PUC Testing Center'
  );
  const [emissionNorms, setEmissionNorms] = useState(
    vehicle.puc.emissionNorms || 'BS-VI'
  );
  const [notes, setNotes] = useState(vehicle.puc.notes || '');

  const handleQuickPreset = (days: number) => {
    setIssueDate(today);
    setExpiryDate(getRelativeDateString(days));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePUC(vehicle.id, {
      certificateNumber: certNo.trim() || `PUC-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate,
      expiryDate,
      testingCenter: testingCenter.trim(),
      emissionNorms,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Renew PUC Certificate</h3>
              <p className="text-xs text-slate-400">
                {vehicle.nickname} • <span className="font-mono">{vehicle.registrationNumber}</span>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Certificate Number
            </label>
            <input
              type="text"
              required
              value={certNo}
              onChange={(e) => setCertNo(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-teal-400 mb-1">
                New Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-teal-500/60 font-bold text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1.5">
              Validity Duration Presets:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(180)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition text-center"
              >
                6 Months (180d)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(365)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold transition text-center"
              >
                1 Year (365d)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(3)}
                className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition"
                title="Set to 3 days to test the 5-day alert"
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                3 Days (Test)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Testing Station
            </label>
            <input
              type="text"
              value={testingCenter}
              onChange={(e) => setTestingCenter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Emission Norms
            </label>
            <input
              type="text"
              value={emissionNorms}
              onChange={(e) => setEmissionNorms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-teal-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirm & Update PUC</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
