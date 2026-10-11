import React, { useState } from 'react';
import { Vehicle, VehicleType, FuelType } from '../types/vehicle';
import { getRelativeDateString, getTodayString } from '../services/db';
import {
  X,
  Car,
  Bike,
  Truck,
  Shield,
  FileCheck2,
  Gauge,
  Binary,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialVehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddEditVehicleModal: React.FC<Props> = ({
  initialVehicle,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEdit = !!initialVehicle;
  const today = getTodayString();

  // Basic Info
  const [nickname, setNickname] = useState(initialVehicle?.nickname || '');
  const [type, setType] = useState<VehicleType>(initialVehicle?.type || 'car');
  const [make, setMake] = useState(initialVehicle?.make || '');
  const [model, setModel] = useState(initialVehicle?.model || '');
  const [year, setYear] = useState<number>(initialVehicle?.year || 2023);
  const [fuelType, setFuelType] = useState<FuelType>(initialVehicle?.fuelType || 'Petrol');
  const [color, setColor] = useState(initialVehicle?.color || '');

  // Vital Identifiers
  const [registrationNumber, setRegistrationNumber] = useState(
    initialVehicle?.registrationNumber || ''
  );
  const [chassisNumber, setChassisNumber] = useState(initialVehicle?.chassisNumber || '');
  const [engineNumber, setEngineNumber] = useState(initialVehicle?.engineNumber || '');
  const [rcNumber, setRcNumber] = useState(initialVehicle?.rcNumber || '');

  // PUC Details
  const [pucNumber, setPucNumber] = useState(initialVehicle?.puc.certificateNumber || '');
  const [pucIssueDate, setPucIssueDate] = useState(
    initialVehicle?.puc.issueDate || getRelativeDateString(-360)
  );
  const [pucExpiryDate, setPucExpiryDate] = useState(
    initialVehicle?.puc.expiryDate || getRelativeDateString(5) // Defaults to 5 days or existing
  );
  const [pucCenter, setPucCenter] = useState(initialVehicle?.puc.testingCenter || '');
  const [pucNorms, setPucNorms] = useState(initialVehicle?.puc.emissionNorms || 'BS-VI');
  const [pucNotes, setPucNotes] = useState(initialVehicle?.puc.notes || '');

  // Insurance Details
  const [insPolicyNo, setInsPolicyNo] = useState(initialVehicle?.insurance.policyNumber || '');
  const [insProvider, setInsProvider] = useState(initialVehicle?.insurance.provider || '');
  const [insType, setInsType] = useState(
    initialVehicle?.insurance.policyType || 'Comprehensive'
  );
  const [insStartDate, setInsStartDate] = useState(
    initialVehicle?.insurance.startDate || getRelativeDateString(-300)
  );
  const [insExpiryDate, setInsExpiryDate] = useState(
    initialVehicle?.insurance.expiryDate || getRelativeDateString(60)
  );
  const [insIdv, setInsIdv] = useState<number | undefined>(initialVehicle?.insurance.idvValue);
  const [insPremium, setInsPremium] = useState<number | undefined>(
    initialVehicle?.insurance.premiumAmount
  );
  const [insHelpline, setInsHelpline] = useState(
    initialVehicle?.insurance.emergencyHelpline || ''
  );

  // Tyre Pressure Details
  const isTwoWheeler = type === 'motorcycle' || type === 'scooter';
  const [recFront, setRecFront] = useState<number>(
    initialVehicle?.tyrePressure.recommendedFront || (isTwoWheeler ? 30 : 32)
  );
  const [recRear, setRecRear] = useState<number>(
    initialVehicle?.tyrePressure.recommendedRear || (isTwoWheeler ? 34 : 35)
  );
  const [curFrontLeft, setCurFrontLeft] = useState<number>(
    initialVehicle?.tyrePressure.currentFrontLeft || (isTwoWheeler ? 30 : 32)
  );
  const [curFrontRight, setCurFrontRight] = useState<number>(
    initialVehicle?.tyrePressure.currentFrontRight || 32
  );
  const [curRearLeft, setCurRearLeft] = useState<number>(
    initialVehicle?.tyrePressure.currentRearLeft || (isTwoWheeler ? 34 : 35)
  );
  const [curRearRight, setCurRearRight] = useState<number>(
    initialVehicle?.tyrePressure.currentRearRight || 35
  );
  const [pressureInterval, setPressureInterval] = useState<number>(
    initialVehicle?.tyrePressure.checkIntervalDays || 14
  );

  // Maintenance
  const [odometerKm, setOdometerKm] = useState<number>(
    initialVehicle?.maintenance?.currentOdometerKm || 15000
  );

  // Active form tab
  const [activeTab, setActiveTab] = useState<'vital' | 'puc' | 'insurance' | 'pressure'>('vital');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationNumber.trim()) {
      alert('Please enter a Registration Plate Number');
      setActiveTab('vital');
      return;
    }

    const payload: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'> = {
      nickname: nickname.trim() || `${make || 'My'} ${model || 'Vehicle'}`,
      type,
      make: make.trim() || 'Custom',
      model: model.trim() || 'Model',
      year: Number(year) || 2023,
      fuelType,
      color: color.trim() || 'Standard',
      registrationNumber: registrationNumber.trim().toUpperCase(),
      chassisNumber: chassisNumber.trim().toUpperCase(),
      engineNumber: engineNumber.trim().toUpperCase(),
      rcNumber: rcNumber.trim().toUpperCase(),
      puc: {
        certificateNumber: pucNumber.trim() || `PUC-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: pucIssueDate || today,
        expiryDate: pucExpiryDate || getRelativeDateString(5),
        testingCenter: pucCenter.trim() || 'Authorized PUC Center',
        emissionNorms: pucNorms,
        notes: pucNotes,
      },
      insurance: {
        policyNumber: insPolicyNo.trim() || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        provider: insProvider.trim() || 'General Insurance Co.',
        policyType: insType as 'Comprehensive',
        startDate: insStartDate || today,
        expiryDate: insExpiryDate || getRelativeDateString(90),
        idvValue: insIdv ? Number(insIdv) : undefined,
        premiumAmount: insPremium ? Number(insPremium) : undefined,
        emergencyHelpline: insHelpline.trim() || '1800 100 2000',
      },
      tyrePressure: {
        unit: 'PSI',
        recommendedFront: Number(recFront) || 32,
        recommendedRear: Number(recRear) || 35,
        currentFrontLeft: Number(curFrontLeft) || 32,
        currentFrontRight: isTwoWheeler ? Number(curFrontLeft) : Number(curFrontRight) || 32,
        currentRearLeft: Number(curRearLeft) || 35,
        currentRearRight: isTwoWheeler ? Number(curRearLeft) : Number(curRearRight) || 35,
        lastCheckedDate: today,
        checkIntervalDays: Number(pressureInterval) || 14,
        logs: initialVehicle?.tyrePressure.logs || [
          {
            id: 'log-' + Date.now(),
            timestamp: today + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            frontLeft: Number(curFrontLeft) || 32,
            frontRight: Number(curFrontRight) || 32,
            rearLeft: Number(curRearLeft) || 35,
            rearRight: Number(curRearRight) || 35,
            notes: 'Initial reading recorded',
          },
        ],
      },
      maintenance: {
        currentOdometerKm: Number(odometerKm) || 0,
      },
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Android Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
              {isEdit ? 'Vehicle Settings' : 'New Vehicle Entry'}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {isEdit ? `Edit ${initialVehicle.nickname}` : 'Add Vehicle to Garage'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('vital')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'vital'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Vehicle & IDs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('puc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'puc'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>PUC Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('insurance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'insurance'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Insurance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pressure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'pressure'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Tyre Pressure</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: VEHICLE & VITAL IDS */}
          {activeTab === 'vital' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5" />
                  Mandatory Legal Identifiers
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registration Number (Number Plate) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 12 AB 1234 or DL 01 QW 9999"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-white text-sm focus:outline-none focus:border-teal-400 tracking-wider"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format: State code + RTO + Series + 4 digits
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Chassis Number (VIN) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MAT623456N1A12908"
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400 uppercase"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">17-character VIN on RC book</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Engine Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EV7342981M09 / K12M7654321"
                      value={engineNumber}
                      onChange={(e) => setEngineNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400 uppercase"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Stamped on engine block & RC</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    RC Book Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RC-MH12-2023-89021"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Vehicle Characteristics */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Vehicle Profile
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Nickname / Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. My Nexon, Red Bullet"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as VehicleType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    >
                      <option value="car">Car (Sedan/Hatchback)</option>
                      <option value="suv">SUV / Crossover</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="scooter">Scooter</option>
                      <option value="commercial">Commercial Vehicle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Tata, Honda"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Nexon, City"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Fuel Type</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as FuelType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric (EV)</option>
                      <option value="CNG">CNG</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Odometer (KM)
                    </label>
                    <input
                      type="number"
                      value={odometerKm}
                      onChange={(e) => setOdometerKm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PUC CERTIFICATE (PRIMARY REQUIREMENT) */}
          {activeTab === 'puc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <FileCheck2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong className="text-amber-100 font-bold block mb-0.5">
                    Automated 5-Day Push Alert Protection
                  </strong>
                  AutoVault continuously scans this expiry date. You will receive an immediate push alert 5 days before expiration, plus daily reminders until renewed!
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      PUC Certificate No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PUC-MH12-984210"
                      value={pucNumber}
                      onChange={(e) => setPucNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Emission Norms
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BS-VI, BS-IV, EV Compliant"
                      value={pucNorms}
                      onChange={(e) => setPucNorms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={pucIssueDate}
                      onChange={(e) => setPucIssueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center justify-between">
                      <span>Expiry Date *</span>
                      <span className="text-[10px] text-amber-400 font-bold">5-day alert target</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={pucExpiryDate}
                      onChange={(e) => setPucExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/60 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Quick Date Presets for user convenience */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                    Quick Expiry Date Presets:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPucExpiryDate(getRelativeDateString(3))}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/40 transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      In 3 Days (Test 5-Day Alert)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPucExpiryDate(getRelativeDateString(5))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Exactly 5 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setPucExpiryDate(getRelativeDateString(180))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition"
                    >
                      +6 Months (180d)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPucExpiryDate(getRelativeDateString(365))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition"
                    >
                      +1 Year (365d)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Testing Center / Station
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Oil Petrol Pump PUC Kiosk, Bandra"
                    value={pucCenter}
                    onChange={(e) => setPucCenter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. CO: 0.15%, HC: 70 ppm. Receipt kept in glovebox"
                    value={pucNotes}
                    onChange={(e) => setPucNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSURANCE */}
          {activeTab === 'insurance' && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Insurance Policy Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3005/291823901/00"
                    value={insPolicyNo}
                    onChange={(e) => setInsPolicyNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ICICI Lombard, HDFC ERGO, Acko"
                    value={insProvider}
                    onChange={(e) => setInsProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Policy Type
                  </label>
                  <select
                    value={insType}
                    onChange={(e) => setInsType(e.target.value as 'Comprehensive')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  >
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Zero Dep">Zero Depreciation (Bumper to Bumper)</option>
                    <option value="Third Party">Third Party Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Emergency Helpline / RSA
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1800 2666 / 1800 103 2277"
                    value={insHelpline}
                    onChange={(e) => setInsHelpline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={insStartDate}
                    onChange={(e) => setInsStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={insExpiryDate}
                    onChange={(e) => setInsExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    IDV Value (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 850000"
                    value={insIdv || ''}
                    onChange={(e) => setInsIdv(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Annual Premium (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 18200"
                    value={insPremium || ''}
                    onChange={(e) => setInsPremium(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TYRE PRESSURE */}
          {activeTab === 'pressure' && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                Tyre Pressure Configuration (PSI)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Recommended Front (PSI)
                  </label>
                  <input
                    type="number"
                    value={recFront}
                    onChange={(e) => setRecFront(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Recommended Rear (PSI)
                  </label>
                  <input
                    type="number"
                    value={recRear}
                    onChange={(e) => setRecRear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="block text-xs font-semibold text-slate-400 mb-2">
                  Current Tyre Pressure Readings (PSI)
                </span>

                {isTwoWheeler ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Front Tyre</label>
                      <input
                        type="number"
                        value={curFrontLeft}
                        onChange={(e) => setCurFrontLeft(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Rear Tyre</label>
                      <input
                        type="number"
                        value={curRearLeft}
                        onChange={(e) => setCurRearLeft(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Front Left (FL)</label>
                      <input
                        type="number"
                        value={curFrontLeft}
                        onChange={(e) => setCurFrontLeft(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Front Right (FR)</label>
                      <input
                        type="number"
                        value={curFrontRight}
                        onChange={(e) => setCurFrontRight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Rear Left (RL)</label>
                      <input
                        type="number"
                        value={curRearLeft}
                        onChange={(e) => setCurRearLeft(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Rear Right (RR)</label>
                      <input
                        type="number"
                        value={curRearRight}
                        onChange={(e) => setCurRearRight(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Check Reminder Interval (Days)
                </label>
                <input
                  type="number"
                  value={pressureInterval}
                  onChange={(e) => setPressureInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                />
                <p className="text-[10px] text-slate-400 mt-1">Recommended: Every 14 days</p>
              </div>
            </div>
          )}

          {/* Modal Footer with Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black tracking-wide shadow-lg shadow-teal-500/20 transition active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEdit ? 'Save Changes' : 'Add Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
