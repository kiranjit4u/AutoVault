import React, { useState } from 'react';
import { Vehicle, VehicleAlert } from '../types/vehicle';
import { notificationService, playAndroidChime, triggerHaptic } from '../services/notifications';
import { db, AppSettings } from '../services/db';
import {
  Bell,
  BellRing,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Settings,
  FileCheck2,
  Shield,
  Gauge,
  ExternalLink,
} from 'lucide-react';

interface Props {
  vehicles: Vehicle[];
  alerts: VehicleAlert[];
  onRenewPUC: (vehicle: Vehicle) => void;
  onRenewInsurance: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onTriggerTestAlert: (type?: 'puc' | 'insurance') => void;
}

export const PUCAlertsCenter: React.FC<Props> = ({
  vehicles,
  alerts,
  onRenewPUC,
  onRenewInsurance,
  onSelectVehicle,
  onTriggerTestAlert,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [testSent, setTestSent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'puc' | 'insurance' | 'pressure'>('all');

  const handleRequestPermission = async () => {
    const status = await notificationService.requestPermission();
    setPermission(status);
    if (status === 'granted') {
      notificationService.sendPushNotification(
        '🔔 AutoVault Push Alerts Active!',
        'You will receive push notifications for upcoming PUC and Insurance expirations.'
      );
    }
  };

  const handleToggleSound = () => {
    const updated = db.saveSettings({ soundAlertsEnabled: !settings.soundAlertsEnabled });
    setSettings(updated);
    if (updated.soundAlertsEnabled) {
      playAndroidChime();
    }
  };

  const handleUpdatePucThreshold = (days: number) => {
    const updated = db.saveSettings({ pucAlertDaysBefore: days });
    setSettings(updated);
  };

  const handleUpdateInsuranceThreshold = (days: number) => {
    const updated = db.saveSettings({ insuranceAlertDaysBefore: days });
    setSettings(updated);
  };

  const pucAlerts = alerts.filter(
    (a) => a.type === 'puc_expiring' || a.type === 'puc_expired'
  );

  const insuranceAlerts = alerts.filter(
    (a) => a.type === 'insurance_expiring' || a.type === 'insurance_expired'
  );

  const pressureAlerts = alerts.filter(
    (a) => a.type === 'pressure_overdue'
  );

  const displayedAlerts = alerts.filter((a) => {
    if (filterType === 'all') return true;
    if (filterType === 'puc') return a.type === 'puc_expiring' || a.type === 'puc_expired';
    if (filterType === 'insurance') return a.type === 'insurance_expiring' || a.type === 'insurance_expired';
    if (filterType === 'pressure') return a.type === 'pressure_overdue';
    return true;
  });

  const sendTest = (type: 'puc' | 'insurance') => {
    onTriggerTestAlert(type);
    setTestSent(type);
    setTimeout(() => setTestSent(null), 3000);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Top Banner / Hero */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Active Guardian
              </span>
              <span className="text-xs text-slate-400">Android Alert Radar</span>
            </div>
            <h2 className="text-xl font-black text-white mt-2 tracking-tight">
              PUC & Insurance Expiration Radar
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-md">
              Monitors PUC certificates (5-day alerts) and insurance policies (15-day alerts). Dispatches native push notifications, haptics, and audio chimes to protect against vehicle fines.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* Quick Summary Pill Row */}
        <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-semibold">PUC Alerts</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              pucAlerts.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {pucAlerts.length} Active
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-slate-300 font-semibold">Insurance Alerts</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              insuranceAlerts.length > 0 ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {insuranceAlerts.length} Active
            </span>
          </div>
        </div>

        {/* Push Notification System Status & Test Triggers */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              permission === 'granted' ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 animate-pulse'
            }`} />
            <span className="text-xs font-semibold text-slate-200">
              System Push: {permission === 'granted' ? 'Enabled' : 'Needs Permission'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                Allow Push
              </button>
            )}

            <button
              onClick={() => sendTest('puc')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-[11px] transition flex items-center gap-1"
              title="Test PUC 5-day expiration alert"
            >
              <Sparkles className="w-3 h-3" />
              <span>{testSent === 'puc' ? 'Sent!' : 'Test PUC'}</span>
            </button>

            <button
              onClick={() => sendTest('insurance')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-[11px] transition flex items-center gap-1"
              title="Test Insurance expiration alert"
            >
              <Sparkles className="w-3 h-3" />
              <span>{testSent === 'insurance' ? 'Sent!' : 'Test Insurance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl transition ${
            filterType === 'all'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setFilterType('insurance')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
            filterType === 'insurance'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-teal-300 border border-teal-500/30 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Insurance ({insuranceAlerts.length})</span>
        </button>
        <button
          onClick={() => setFilterType('puc')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
            filterType === 'puc'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>PUC ({pucAlerts.length})</span>
        </button>
        <button
          onClick={() => setFilterType('pressure')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
            filterType === 'pressure'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Tyres ({pressureAlerts.length})</span>
        </button>
      </div>

      {/* SECTION 1: INSURANCE EXPIRATION RADAR (When filtered for all or insurance) */}
      {(filterType === 'all' || filterType === 'insurance') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Insurance Expiration Watchlist ({settings.insuranceAlertDaysBefore || 15}-Day Window)
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300">
              {insuranceAlerts.length} Due
            </span>
          </div>

          {insuranceAlerts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">All Insurance Policies are Active</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No insurance policies expiring within {settings.insuranceAlertDaysBefore || 15} days.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {insuranceAlerts.map((alert) => {
                const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
                const isExpired = alert.daysRemaining < 0;

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isExpired
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/20'
                        : 'bg-teal-950/30 border-teal-500/50 shadow-md shadow-teal-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                        }`}>
                          {isExpired ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                              isExpired ? 'bg-rose-500 text-white' : 'bg-teal-500 text-slate-950'
                            }`}>
                              {isExpired ? 'Expired' : `${alert.daysRemaining} Days Left`}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {alert.message}
                          </p>

                          <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap items-center gap-2 font-mono">
                            <span>Plate: <strong className="text-slate-200">{alert.registrationNumber}</strong></span>
                            <span>•</span>
                            <span>Expiry: <strong className={isExpired ? 'text-rose-400' : 'text-teal-300'}>{alert.dueDate}</strong></span>
                            {vehicle?.insurance.provider && (
                              <>
                                <span>•</span>
                                <span className="text-slate-300 font-sans">{vehicle.insurance.provider}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {vehicle && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => onRenewInsurance(vehicle)}
                            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-sm text-center"
                          >
                            Renew Policy
                          </button>
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition text-center"
                          >
                            Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: PUC EXPIRATION RADAR (When filtered for all or puc) */}
      {(filterType === 'all' || filterType === 'puc') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                PUC Expiration Watchlist ({settings.pucAlertDaysBefore || 5}-Day Window)
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
              {pucAlerts.length} Due
            </span>
          </div>

          {pucAlerts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">All PUC Certificates are Valid!</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No vehicles have PUC expiring within the {settings.pucAlertDaysBefore || 5}-day alert window.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pucAlerts.map((alert) => {
                const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
                const isExpired = alert.daysRemaining < 0;

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isExpired
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/20'
                        : 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {isExpired ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                              isExpired ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950 animate-pulse'
                            }`}>
                              {isExpired ? 'Expired' : `${alert.daysRemaining} Days Left`}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {alert.message}
                          </p>

                          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                            <span>Plate: <strong className="text-slate-200">{alert.registrationNumber}</strong></span>
                            <span>•</span>
                            <span>Due: <strong className={isExpired ? 'text-rose-400' : 'text-amber-400'}>{alert.dueDate}</strong></span>
                          </div>
                        </div>
                      </div>

                      {vehicle && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => onRenewPUC(vehicle)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm text-center"
                          >
                            Renew PUC
                          </button>
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition text-center"
                          >
                            Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: TYRE PRESSURE OVERDUE REMINDERS */}
      {(filterType === 'all' || filterType === 'pressure') && pressureAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Tyre Pressure Overdue Checks
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {pressureAlerts.length}
            </span>
          </div>

          <div className="space-y-2">
            {pressureAlerts.map((alert) => {
              const vehicle = vehicles.find((v) => v.id === alert.vehicleId);
              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.message}</p>
                  </div>
                  {vehicle && (
                    <button
                      onClick={() => onSelectVehicle(vehicle)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium shrink-0"
                    >
                      Check
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Push Notification Preferences & Thresholds */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" />
          Alert Windows & Preferences
        </h3>

        <div className="space-y-3">
          {/* Insurance Threshold */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                Insurance Advance Alert Window
              </span>
              <span className="text-[11px] text-slate-400">
                Days before insurance expiry to notify
              </span>
            </div>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[5, 7, 15, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => handleUpdateInsuranceThreshold(days)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                    (settings.insuranceAlertDaysBefore || 15) === days
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* PUC Threshold */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-white block">
                PUC Advance Alert Window
              </span>
              <span className="text-[11px] text-slate-400">
                Days before PUC expiry to notify (Default 5 days)
              </span>
            </div>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[3, 5, 7, 10].map((days) => (
                <button
                  key={days}
                  onClick={() => handleUpdatePucThreshold(days)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                    settings.pucAlertDaysBefore === days
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Haptics */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-white block">
                Sound Chimes & Haptic Vibration
              </span>
              <span className="text-[11px] text-slate-400">
                Play dual-tone Android notification chime & vibrate
              </span>
            </div>
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-bold ${
                settings.soundAlertsEnabled
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{settings.soundAlertsEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
