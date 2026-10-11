import { Vehicle, VehicleAlert } from '../types/vehicle';
import { db } from './db';

const LAST_NOTIFIED_KEY = 'autovault_last_notified_timestamps';

// Calculates difference in days between two YYYY-MM-DD dates
export function getDaysRemaining(dateString: string): number {
  if (!dateString) return 999;
  const target = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Synthesizes a clean, pleasant Android Material chime using Web Audio API
export function playAndroidChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Tone 1: 587.33 Hz (D5) -> 880 Hz (A5)
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    osc2.frequency.setValueAtTime(880, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.1);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.debug('Web audio playback bypassed', e);
  }
}

// Native vibration pattern simulation
export function triggerHaptic(): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([120, 60, 120]);
    }
  } catch (e) {
    console.debug('Haptics not supported', e);
  }
}

export const notificationService = {
  isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermissionStatus(): NotificationPermission {
    if (!this.isNotificationSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.error('Error requesting notification permission', e);
      return 'denied';
    }
  },

  // Generates alerts list based on current vehicles and user criteria (e.g. <= 5 days for PUC)
  evaluateAllAlerts(vehicles: Vehicle[]): VehicleAlert[] {
    const settings = db.getSettings();
    const pucThreshold = settings.pucAlertDaysBefore || 5;
    const alerts: VehicleAlert[] = [];

    for (const vehicle of vehicles) {
      // 1. PUC Certificate Check
      if (vehicle.puc && vehicle.puc.expiryDate) {
        const days = getDaysRemaining(vehicle.puc.expiryDate);

        if (days < 0) {
          alerts.push({
            id: `puc-exp-${vehicle.id}-${vehicle.puc.expiryDate}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.nickname || `${vehicle.make} ${vehicle.model}`,
            registrationNumber: vehicle.registrationNumber,
            type: 'puc_expired',
            title: `🚨 PUC Expired (${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago)`,
            message: `${vehicle.nickname} (${vehicle.registrationNumber}) PUC certificate expired on ${vehicle.puc.expiryDate}. Immediate renewal required to avoid traffic fines!`,
            daysRemaining: days,
            severity: 'critical',
            dueDate: vehicle.puc.expiryDate,
            timestamp: new Date().toISOString(),
          });
        } else if (days <= pucThreshold) {
          alerts.push({
            id: `puc-soon-${vehicle.id}-${vehicle.puc.expiryDate}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.nickname || `${vehicle.make} ${vehicle.model}`,
            registrationNumber: vehicle.registrationNumber,
            type: 'puc_expiring',
            title: `⚠️ PUC Expiring in ${days === 0 ? 'Today!' : `${days} day${days > 1 ? 's' : ''}`}`,
            message: `${vehicle.nickname} (${vehicle.registrationNumber}) PUC valid until ${vehicle.puc.expiryDate}. Only ${days} day${days > 1 ? 's' : ''} left to renew!`,
            daysRemaining: days,
            severity: days <= 2 ? 'critical' : 'warning',
            dueDate: vehicle.puc.expiryDate,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // 2. Insurance Expiry Check (within 7 days or expired)
      if (vehicle.insurance && vehicle.insurance.expiryDate) {
        const insDays = getDaysRemaining(vehicle.insurance.expiryDate);
        if (insDays < 0) {
          alerts.push({
            id: `ins-exp-${vehicle.id}-${vehicle.insurance.expiryDate}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.nickname,
            registrationNumber: vehicle.registrationNumber,
            type: 'insurance_expired',
            title: `🚨 Insurance Expired`,
            message: `${vehicle.nickname} insurance policy (${vehicle.insurance.provider}) expired on ${vehicle.insurance.expiryDate}. Vehicle is uninsured!`,
            daysRemaining: insDays,
            severity: 'critical',
            dueDate: vehicle.insurance.expiryDate,
            timestamp: new Date().toISOString(),
          });
        } else if (insDays <= 7) {
          alerts.push({
            id: `ins-soon-${vehicle.id}-${vehicle.insurance.expiryDate}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.nickname,
            registrationNumber: vehicle.registrationNumber,
            type: 'insurance_expiring',
            title: `🛡️ Insurance Renewal Due in ${insDays} day${insDays > 1 ? 's' : ''}`,
            message: `${vehicle.nickname} policy with ${vehicle.insurance.provider} expires on ${vehicle.insurance.expiryDate}.`,
            daysRemaining: insDays,
            severity: insDays <= 3 ? 'critical' : 'warning',
            dueDate: vehicle.insurance.expiryDate,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // 3. Tyre Pressure Overdue Check
      if (vehicle.tyrePressure && vehicle.tyrePressure.lastCheckedDate) {
        const lastCheckedDays = -getDaysRemaining(vehicle.tyrePressure.lastCheckedDate);
        const interval = vehicle.tyrePressure.checkIntervalDays || 14;
        if (lastCheckedDays > interval) {
          alerts.push({
            id: `press-overdue-${vehicle.id}-${vehicle.tyrePressure.lastCheckedDate}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.nickname,
            registrationNumber: vehicle.registrationNumber,
            type: 'pressure_overdue',
            title: `💨 Tyre Pressure Check Overdue`,
            message: `Last checked ${lastCheckedDays} days ago (recommended every ${interval} days). Check PSI for safety & mileage.`,
            daysRemaining: -lastCheckedDays,
            severity: 'info',
            dueDate: vehicle.tyrePressure.lastCheckedDate,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return alerts;
  },

  // Dispatches actual browser Web Push notification + sound
  sendPushNotification(title: string, body: string, tag?: string): boolean {
    const settings = db.getSettings();

    // Trigger in-app sound if enabled
    if (settings.soundAlertsEnabled) {
      playAndroidChime();
      triggerHaptic();
    }

    if (!this.isNotificationSupported()) {
      return false;
    }

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
          badge: '/icon.svg',
          tag: tag || 'autovault-alert',
          silent: !settings.soundAlertsEnabled,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        return true;
      } catch (e) {
        console.error('Failed to instantiate system Notification', e);
        return false;
      }
    }

    return false;
  },

  // Checks and dispatches push alerts if not previously dispatched today
  checkAndTriggerPushAlerts(vehicles: Vehicle[]): VehicleAlert[] {
    const alerts = this.evaluateAllAlerts(vehicles);
    const settings = db.getSettings();

    if (!settings.pushNotificationsEnabled) return alerts;

    try {
      const storedTimestamps: Record<string, string> = JSON.parse(
        localStorage.getItem(LAST_NOTIFIED_KEY) || '{}'
      );
      const today = new Date().toISOString().split('T')[0];

      // Prioritize 5-day PUC alerts
      const pucAlerts = alerts.filter(
        (a) => a.type === 'puc_expiring' || a.type === 'puc_expired'
      );

      for (const alert of pucAlerts) {
        const lastSent = storedTimestamps[alert.id];
        // Send once per day per specific alert ID
        if (lastSent !== today) {
          this.sendPushNotification(alert.title, alert.message, alert.id);
          storedTimestamps[alert.id] = today;
        }
      }

      localStorage.setItem(LAST_NOTIFIED_KEY, JSON.stringify(storedTimestamps));
    } catch (e) {
      console.error('Error in checkAndTriggerPushAlerts', e);
    }

    return alerts;
  },
};
