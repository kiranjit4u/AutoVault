import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { getTodayString, getRelativeDateString } from '../services/db';
import { X, Shield, Check, Sparkles, PhoneCall } from 'lucide-react';

interface Props {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveInsurance: (vehicleId: string, updatedInsurance: Vehicle['insurance']) => void;
}

export const RenewInsuranceModal: React.FC<Props> = ({
  vehicle,
  isOpen,
  onClose,
  onSaveInsurance,
}) => {
  if (!isOpen || !vehicle) return null;

  const today = getTodayString();
  const [policyNo, setPolicyNo] = useState(
    vehicle.insurance.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [provider, setProvider] = useState(
    vehicle.insurance.provider || 'ICICI Lombard General Insurance'
  );
  const [policyType, setPolicyType] = useState(
    vehicle.insurance.policyType || 'Comprehensive'
  );
  const [startDate, setStartDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState(getRelativeDateString(365)); // 1 year standard
  const [idvValue, setIdvValue] = useState<number | undefined>(
    vehicle.insurance.idvValue || 850000
  );
  const [premiumAmount, setPremiumAmount] = useState<number | undefined>(
    vehicle.insurance.premiumAmount || 18500
  );
  const [emergencyHelpline, setEmergencyHelpline] = useState(
    vehicle.insurance.emergencyHelpline || '1800 2666'
  );
  const [notes, setNotes] = useState(vehicle.insurance.notes || '');

  const handleQuickPreset = (days: number) => {
    setStartDate(today);
    setExpiryDate(getRelativeDateString(days));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInsurance(vehicle.id, {
      policyNumber: policyNo.trim() || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      provider: provider.trim() || 'General Insurance',
      policyType: policyType as 'Comprehensive',
      startDate,
      expiryDate,
      idvValue: idvValue ? Number(idvValue) : undefined,
      premiumAmount: premiumAmount ? Number(premiumAmount) : undefined,
      emergencyHelpline: emergencyHelpline.trim(),
      notes,
    });
    onClose();
  };

  const commonProviders = [
    'ICICI Lombard',
    'HDFC ERGO',
    'Bajaj Allianz',
    'Tata AIG',
    'Acko',
    'Go Digit',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-5 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Renew Insurance Policy</h3>
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
              New Policy Number *
            </label>
            <input
              type="text"
              required
              value={policyNo}
              onChange={(e) => setPolicyNo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Insurance Provider
            </label>
            <input
              type="text"
              required
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
            />
            {/* Quick provider chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {commonProviders.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setProvider(p)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Policy Type
            </label>
            <select
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value as 'Comprehensive')}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
            >
              <option value="Comprehensive">Comprehensive</option>
              <option value="Zero Dep">Zero Depreciation (Bumper to Bumper)</option>
              <option value="Third Party">Third Party Only</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                onClick={() => handleQuickPreset(365)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold transition text-center"
              >
                1 Year (365d)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(365 * 3)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition text-center"
              >
                3 Years
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(4)}
                className="py-1.5 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition"
                title="Set to 4 days to test insurance alert"
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                4 Days (Test)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                IDV Cover (₹)
              </label>
              <input
                type="number"
                value={idvValue || ''}
                onChange={(e) => setIdvValue(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Premium Paid (₹)
              </label>
              <input
                type="number"
                value={premiumAmount || ''}
                onChange={(e) => setPremiumAmount(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Emergency Helpline / Roadside Assistance (RSA)
            </label>
            <input
              type="text"
              value={emergencyHelpline}
              onChange={(e) => setEmergencyHelpline(e.target.value)}
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
              <span>Confirm & Update Policy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
