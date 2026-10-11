import React from 'react';
import { VehicleAlert } from '../types/vehicle';
import { AlertTriangle, Bell, X, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  alert: VehicleAlert | null;
  onDismiss: () => void;
  onViewVehicle: (vehicleId: string) => void;
  onRenewPUC?: (vehicleId: string) => void;
}

export const AndroidNotificationBanner: React.FC<Props> = ({
  alert,
  onDismiss,
  onViewVehicle,
  onRenewPUC,
}) => {
  if (!alert) return null;

  const isCritical = alert.severity === 'critical';

  return (
    <div className="fixed top-3 inset-x-3 max-w-md mx-auto z-50 animate-in slide-in-from-top-6 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all ${
        isCritical
          ? 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-950/40'
          : 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/30'
      }`}>
        {/* Android notification header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <Bell className="w-3 h-3" />
            </div>
            <span className="font-semibold text-slate-200">AutoVault Alert System</span>
            <span>•</span>
            <span className="text-[11px] text-slate-400">Now</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight truncate">
                {alert.title}
              </h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
              }`}>
                {alert.daysRemaining <= 0 ? 'Expired' : `${alert.daysRemaining}d Left`}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {alert.message}
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3 pt-1">
              <button
                onClick={() => {
                  onViewVehicle(alert.vehicleId);
                  onDismiss();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              {onRenewPUC && (alert.type === 'puc_expiring' || alert.type === 'puc_expired') && (
                <button
                  onClick={() => {
                    onRenewPUC(alert.vehicleId);
                    onDismiss();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs border border-teal-500/30 transition"
                >
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  <span>Renew PUC</span>
                </button>
              )}

              <button
                onClick={onDismiss}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium ml-auto"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
