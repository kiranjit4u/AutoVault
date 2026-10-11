import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { db } from '../services/db';
import {
  FileText,
  Binary,
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  Search,
  Shield,
  FileCheck2,
  Database,
} from 'lucide-react';
import { APKDownloadModal } from './APKDownloadModal';

interface Props {
  vehicles: Vehicle[];
  onReload: () => void;
}

export const DocumentVault: React.FC<Props> = ({ vehicles, onReload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAPKModal, setShowAPKModal] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const jsonStr = db.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autovault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = db.importDatabaseJSON(content);
      if (success) {
        alert('Database restored successfully from backup!');
        onReload();
      } else {
        alert('Invalid database backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Reset local database to initial demo state? (Includes Tata Nexon EV with PUC expiring in 3 days for alert testing)'
      )
    ) {
      db.resetToDefault();
      onReload();
    }
  };

  const filtered = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      v.nickname.toLowerCase().includes(q) ||
      v.registrationNumber.toLowerCase().includes(q) ||
      v.chassisNumber.toLowerCase().includes(q) ||
      v.engineNumber.toLowerCase().includes(q) ||
      v.puc.certificateNumber.toLowerCase().includes(q) ||
      v.insurance.policyNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
              Local Vault & Hardware IDs
            </span>
            <h2 className="text-lg font-black text-white mt-1 tracking-tight">
              Vehicle Documents & Identity Registry
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Instant access to Chassis (VIN), Engine, PUC, and Insurance policy numbers.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400">
            <Binary className="w-5 h-5" />
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by Plate, Chassis, Engine, or Policy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Registry Table / Cards */}
      <div className="space-y-3">
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-sm">{vehicle.nickname}</h3>
                <span className="font-mono text-xs text-teal-300 font-bold">
                  {vehicle.registrationNumber}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {vehicle.make} {vehicle.model}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Chassis */}
              <div
                onClick={() => handleCopy(vehicle.chassisNumber, `chassis-${vehicle.id}`)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition"
                title="Click to copy Chassis Number"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Chassis No (VIN)
                  </span>
                  <span className="font-mono text-slate-200 font-semibold truncate block">
                    {vehicle.chassisNumber || 'N/A'}
                  </span>
                </div>
                {copiedId === `chassis-${vehicle.id}` ? (
                  <Check className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Engine */}
              <div
                onClick={() => handleCopy(vehicle.engineNumber, `engine-${vehicle.id}`)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition"
                title="Click to copy Engine Number"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Engine No
                  </span>
                  <span className="font-mono text-slate-200 font-semibold truncate block">
                    {vehicle.engineNumber || 'N/A'}
                  </span>
                </div>
                {copiedId === `engine-${vehicle.id}` ? (
                  <Check className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* PUC Cert */}
              <div
                onClick={() => handleCopy(vehicle.puc.certificateNumber, `puc-${vehicle.id}`)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition"
                title="Click to copy PUC Certificate Number"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    PUC Certificate No
                  </span>
                  <span className="font-mono text-slate-200 font-semibold truncate block">
                    {vehicle.puc.certificateNumber}
                  </span>
                  <span className="text-[10px] text-amber-400">
                    Expires: {vehicle.puc.expiryDate}
                  </span>
                </div>
                {copiedId === `puc-${vehicle.id}` ? (
                  <Check className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Insurance Policy */}
              <div
                onClick={() => handleCopy(vehicle.insurance.policyNumber, `ins-${vehicle.id}`)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between transition"
                title="Click to copy Insurance Policy Number"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Insurance Policy No
                  </span>
                  <span className="font-mono text-slate-200 font-semibold truncate block">
                    {vehicle.insurance.policyNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {vehicle.insurance.provider}
                  </span>
                </div>
                {copiedId === `ins-${vehicle.id}` ? (
                  <Check className="w-4 h-4 text-teal-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Local Database Backup & Restore Controls */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          Local Database Management
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your vehicles and alert logs are stored locally on your device storage without any external cloud dependency. You can export or import backup files anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Backup</span>
          </button>

          <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetDefaults}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Android APK & WebAPK Hub Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
            Android Distribution
          </span>
          <span className="text-xs font-bold text-teal-300">WebAPK / Standalone APK</span>
        </div>
        <h4 className="text-sm font-bold text-white">Download APK or Install on Phone</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Install directly as a native Android WebAPK with Google Play Services integration, or generate a standalone sideloadable <strong>.apk</strong> file via PWABuilder.
        </p>
        <button
          onClick={() => setShowAPKModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Open Android APK & Install Hub</span>
        </button>
      </div>

      <APKDownloadModal
        isOpen={showAPKModal}
        onClose={() => setShowAPKModal(false)}
      />
    </div>
  );
};
