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
  Smartphone,
  Sparkles,
  Settings,
  FileCheck2,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  vehicles: Vehicle[];
  alerts: VehicleAlert[];
  onRenewPUC: (vehicle: Vehicle) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onTriggerTestAlert: () => void;
}

export const PUCAlertsCenter: React.FC<Props> = ({
  vehicles,
  alerts,
  onRenewPUC,
  onSelectVehicle,
  onTriggerTestAlert,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.getPermissionStatus()
  );
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    const status = await notificationService.requestPermission();
    setPermission(status);
    if (status === 'granted') {
      notificationService.sendPushNotification(
        '🔔 AutoVault Push Alerts Active!',
        'You will receive push notifications 5 days before any vehicle PUC certificate expires.'
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

  const handleUpdateThreshold = (days: number) => {
    const updated = db.saveSettings({ pucAlertDaysBefore: days });
    setSettings(updated);
  };

  const pucAlerts = alerts.filter(
    (a) => a.type === 'puc_expiring' || a.type === 'puc_expired'
  );

  const otherAlerts = alerts.filter(
    (a) => a.type !== 'puc_expiring' && a.type !== 'puc_expired'
  );

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
              <span className="text-xs text-slate-400">Android Alert Center</span>
            </div>
            <h2 className="text-xl font-black text-white mt-2 tracking-tight">
              PUC Expiration & Push Radar
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-md">
              Monitors all vehicle pollution certificates in your local database. Sends instant push alerts <strong>5 days before expiry</strong> to ensure zero penalty fines.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* Push Notification System Status & Test Trigger */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              permission === 'granted' ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400 animate-pulse'
            }`} />
            <span className="text-xs font-semibold text-slate-200">
              System Push: {permission === 'granted' ? 'Enabled & Ready' : 'Permission Required'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                Allow Push Alerts
              </button>
            )}

            <button
              onClick={() => {
                onTriggerTestAlert();
                setTestSent(true);
                setTimeout(() => setTestSent(false), 3000);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs transition flex items-center gap-1.5"
              title="Dispatches a live push notification test"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{testSent ? 'Alert Dispatched!' : 'Test Push Alert'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Day PUC Radar Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              PUC Expiration Watchlist (5-Day Threshold)
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {pucAlerts.length} Attention Needed
          </span>
        </div>

        {pucAlerts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">All PUC Certificates are Valid!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No vehicles have PUC expiring within the 5-day alert window. You will receive a push notification automatically as soon as any certificate enters the 5-day mark.
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
                          className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-sm text-center"
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

      {/* Other Alerts: Insurance & Tyre Overdue */}
      {otherAlerts.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Insurance & Tyre Pressure Reminders
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {otherAlerts.length}
            </span>
          </div>

          <div className="space-y-2">
            {otherAlerts.map((alert) => {
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
                      View
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Push Notification Preferences */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5" />
          Alert Configuration
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                PUC Advance Alert Window
              </span>
              <span className="text-[11px] text-slate-400">
                Number of days before PUC expiry to start push alerts
              </span>
            </div>
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[3, 5, 7, 10].map((days) => (
                <button
                  key={days}
                  onClick={() => handleUpdateThreshold(days)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    settings.pucAlertDaysBefore === days
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-white block">
                Sound Chimes & Haptics
              </span>
              <span className="text-[11px] text-slate-400">
                Play Android notification sound tone and vibrate device
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
