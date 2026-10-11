import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { RegistrationPlate } from './RegistrationPlate';
import { getDaysRemaining } from '../services/notifications';
import {
  X,
  FileCheck2,
  Shield,
  Gauge,
  Binary,
  Copy,
  Check,
  AlertTriangle,
  PhoneCall,
  Calendar,
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onRenewPUC: (vehicle: Vehicle) => void;
  onLogPressure: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<Props> = ({
  vehicle,
  isOpen,
  onClose,
  onEdit,
  onRenewPUC,
  onLogPressure,
}) => {
  if (!isOpen || !vehicle) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'puc' | 'insurance' | 'pressure' | 'hardware'>('overview');
  const [copiedChassis, setCopiedChassis] = useState(false);
  const [copiedEngine, setCopiedEngine] = useState(false);
  const [copiedPolicy, setCopiedPolicy] = useState(false);

  const pucDays = getDaysRemaining(vehicle.puc.expiryDate);
  const insuranceDays = getDaysRemaining(vehicle.insurance.expiryDate);

  const isPUCCritical = pucDays <= 5 && pucDays >= 0;
  const isPUCExpired = pucDays < 0;

  const copyText = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {vehicle.nickname}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                  {vehicle.fuelType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {vehicle.make} {vehicle.model} • {vehicle.year} • {vehicle.color || 'Standard'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <RegistrationPlate
              plateNumber={vehicle.registrationNumber}
              fuelType={vehicle.fuelType}
              size="lg"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => onRenewPUC(vehicle)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Renew PUC</span>
              </button>
              <button
                onClick={() => onLogPressure(vehicle)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Log PSI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('puc')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'puc'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : isPUCCritical || isPUCExpired
                ? 'text-amber-400 hover:bg-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>PUC</span>
            {isPUCCritical && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'insurance'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Insurance
          </button>
          <button
            onClick={() => setActiveTab('pressure')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'pressure'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Tyres
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'hardware'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Chassis & Engine
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* PUC Expiration Warning Banner if in 5-day window */}
              {isPUCCritical && (
                <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 flex items-start gap-3 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">
                      PUC Certificate Expiring in {pucDays === 0 ? 'Today' : `${pucDays} Days`}!
                    </h4>
                    <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
                      Expiry date is <strong>{vehicle.puc.expiryDate}</strong>. Traffic police in many jurisdictions penalize expired PUC with instant ₹10,000 fine.
                    </p>
                    <button
                      onClick={() => onRenewPUC(vehicle)}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
                    >
                      Renew Certificate Now →
                    </button>
                  </div>
                </div>
              )}

              {isPUCExpired && (
                <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">
                      PUC Has Expired ({Math.abs(pucDays)} days ago)
                    </h4>
                    <p className="text-xs text-rose-300/90 mt-1">
                      Certificate expired on <strong>{vehicle.puc.expiryDate}</strong>.
                    </p>
                    <button
                      onClick={() => onRenewPUC(vehicle)}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition"
                    >
                      Update Renewed PUC →
                    </button>
                  </div>
                </div>
              )}

              {/* Status Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>PUC Validity</span>
                    <FileCheck2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {pucDays < 0 ? 'Expired' : `${pucDays} Days`}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Expires: {vehicle.puc.expiryDate}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Insurance</span>
                    <Shield className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {insuranceDays < 0 ? 'Expired' : `${insuranceDays} Days`}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {vehicle.insurance.provider}
                  </div>
                </div>
              </div>

              {/* Quick ID Summary with Instant Copy */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Quick Legal Identifiers
                </h4>

                <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Chassis Number (VIN)</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {vehicle.chassisNumber || 'Not entered'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(vehicle.chassisNumber, setCopiedChassis)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Chassis Number"
                  >
                    {copiedChassis ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Engine Number</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {vehicle.engineNumber || 'Not entered'}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(vehicle.engineNumber, setCopiedEngine)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Engine Number"
                  >
                    {copiedEngine ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Odometer Reading</span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {vehicle.maintenance?.currentOdometerKm?.toLocaleString() || '0'} KM
                    </span>
                  </div>
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="text-xs text-teal-400 hover:underline font-semibold"
                  >
                    Edit All Specs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PUC CERTIFICATE DETAILS */}
          {activeTab === 'puc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-teal-400" />
                    Pollution Under Control (PUC) Certificate
                  </h4>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPUCExpired
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : isPUCCritical
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {isPUCExpired
                      ? 'Expired'
                      : isPUCCritical
                      ? `Expiring in ${pucDays}d`
                      : 'Valid & Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Certificate No</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {vehicle.puc.certificateNumber}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Emission Norms</span>
                    <span className="text-xs font-bold text-white">
                      {vehicle.puc.emissionNorms || 'BS-VI Compliant'}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Issue Date</span>
                    <span className="text-xs font-bold text-slate-200">
                      {vehicle.puc.issueDate}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Expiry Date</span>
                    <span className="text-xs font-bold text-amber-400">
                      {vehicle.puc.expiryDate}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">Testing Center / Station</span>
                  <span className="text-xs font-medium text-slate-200">
                    {vehicle.puc.testingCenter || 'Government Certified Emission Kiosk'}
                  </span>
                </div>

                {vehicle.puc.notes && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 block">Inspection Notes</span>
                    <span className="text-xs text-slate-300">{vehicle.puc.notes}</span>
                  </div>
                )}

                <button
                  onClick={() => onRenewPUC(vehicle)}
                  className="w-full mt-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Update / Renew PUC Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* INSURANCE DETAILS */}
          {activeTab === 'insurance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-400" />
                    Insurance Policy
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30">
                    {vehicle.insurance.policyType}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Policy Number</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {vehicle.insurance.policyNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(vehicle.insurance.policyNumber, setCopiedPolicy)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Policy Number"
                  >
                    {copiedPolicy ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Provider</span>
                    <span className="text-xs font-bold text-white truncate block">
                      {vehicle.insurance.provider}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Expires On</span>
                    <span className="text-xs font-bold text-white">
                      {vehicle.insurance.expiryDate}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">IDV Cover</span>
                    <span className="text-xs font-bold text-teal-400">
                      ₹{vehicle.insurance.idvValue ? vehicle.insurance.idvValue.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Annual Premium</span>
                    <span className="text-xs font-bold text-slate-200">
                      ₹{vehicle.insurance.premiumAmount ? vehicle.insurance.premiumAmount.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {vehicle.insurance.emergencyHelpline && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Emergency RSA / Claims</span>
                      <span className="font-mono text-xs font-bold text-teal-300">
                        {vehicle.insurance.emergencyHelpline}
                      </span>
                    </div>
                    <a
                      href={`tel:${vehicle.insurance.emergencyHelpline.split('/')[0].trim()}`}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TYRE PRESSURE */}
          {activeTab === 'pressure' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    Current Tyre Pressures
                  </h4>
                  <button
                    onClick={() => onLogPressure(vehicle)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
                  >
                    + Log New Check
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Front Tyre(s)</span>
                    <span className="text-lg font-black font-mono text-teal-400">
                      {vehicle.tyrePressure.currentFrontLeft} PSI
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Target: {vehicle.tyrePressure.recommendedFront} PSI
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Rear Tyre(s)</span>
                    <span className="text-lg font-black font-mono text-teal-400">
                      {vehicle.tyrePressure.currentRearLeft} PSI
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Target: {vehicle.tyrePressure.recommendedRear} PSI
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Last checked: <strong className="text-white">{vehicle.tyrePressure.lastCheckedDate}</strong> (Check every {vehicle.tyrePressure.checkIntervalDays || 14} days)
                </div>

                {/* Pressure logs history */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                    Recent Inspection Log
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {vehicle.tyrePressure.logs && vehicle.tyrePressure.logs.length > 0 ? (
                      vehicle.tyrePressure.logs.map((log) => (
                        <div key={log.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono text-slate-300">{log.timestamp}</span>
                            {log.notes && <p className="text-[11px] text-slate-400">{log.notes}</p>}
                          </div>
                          <span className="font-mono font-bold text-cyan-300">
                            {log.frontLeft} / {log.rearLeft} PSI
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No logs recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHASSIS & ENGINE (HARDWARE) */}
          {activeTab === 'hardware' && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5" />
                Physical Vehicle Identification Numbers
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Keep these numbers accessible when speaking to service engineers, RTO officers, or insurance claim surveyors.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Chassis Number (VIN)
                  </span>
                  <button
                    onClick={() => copyText(vehicle.chassisNumber, setCopiedChassis)}
                    className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                  >
                    {copiedChassis ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedChassis ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-white tracking-widest break-all select-all">
                  {vehicle.chassisNumber || 'NOT CONFIGURED'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Engine Number
                  </span>
                  <button
                    onClick={() => copyText(vehicle.engineNumber, setCopiedEngine)}
                    className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300"
                  >
                    {copiedEngine ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEngine ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-white tracking-widest break-all select-all">
                  {vehicle.engineNumber || 'NOT CONFIGURED'}
                </div>
              </div>

              {vehicle.rcNumber && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Registration Certificate (RC) Number
                  </span>
                  <div className="font-mono text-sm font-bold text-white tracking-wider select-all">
                    {vehicle.rcNumber}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <button
            onClick={() => onEdit(vehicle)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Edit Vehicle
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
