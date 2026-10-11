import { Vehicle, ServiceRecord } from '../types/vehicle';

const STORAGE_KEY = 'autovault_vehicles_v1';
const SETTINGS_KEY = 'autovault_settings_v1';

export interface AppSettings {
  pushNotificationsEnabled: boolean;
  soundAlertsEnabled: boolean;
  pucAlertDaysBefore: number; // Default 5 days as requested by user
  insuranceAlertDaysBefore: number; // Default 15 days
  pressureAlertIntervalDays: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  pushNotificationsEnabled: true,
  soundAlertsEnabled: true,
  pucAlertDaysBefore: 5,
  insuranceAlertDaysBefore: 15,
  pressureAlertIntervalDays: 14,
};

// Helper to format date offset in days relative to current date (local timezone)
export function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
  return getRelativeDateString(0);
}

// Generate realistic default vehicles for immediate demonstration
function getInitialVehicles(): Vehicle[] {
  const today = getTodayString();
  const pucIn3Days = getRelativeDateString(3); // <= 5 days, triggers alert!
  const pucLastYear = getRelativeDateString(-362);
  const pucIn60Days = getRelativeDateString(60);
  const insuranceIn45Days = getRelativeDateString(45);
  const insuranceIn4Days = getRelativeDateString(4);

  return [
    {
      id: 'veh-1',
      nickname: 'Daily Cruiser',
      type: 'suv',
      make: 'Tata',
      model: 'Nexon EV Empowered',
      year: 2023,
      fuelType: 'Electric',
      color: 'Daytona Grey',
      registrationNumber: 'MH 12 QW 5678',
      chassisNumber: 'MAT623456N1A12908',
      engineNumber: 'EV7342981M09',
      rcNumber: 'RC-MH12-2023-89021',
      puc: {
        certificateNumber: 'PUC-MH12-984210',
        issueDate: pucLastYear,
        expiryDate: pucIn3Days, // 3 DAYS REMAINING! TRIGGERS 5-DAY ALERT
        testingCenter: 'GreenAuto Testing Center, Kothrud',
        emissionNorms: 'Zero Emission / BS-VI Compliant',
        notes: 'Annual fitness check passed with zero CO2 emission rating',
      },
      insurance: {
        policyNumber: '3005/291823901/00',
        provider: 'ICICI Lombard General Insurance',
        policyType: 'Comprehensive',
        startDate: getRelativeDateString(-320),
        expiryDate: insuranceIn45Days,
        idvValue: 1450000,
        premiumAmount: 28400,
        emergencyHelpline: '1800 2666 / 1800 103 2277 (RSA)',
        notes: 'Includes zero depreciation, engine protect & 24x7 roadside assist',
      },
      tyrePressure: {
        unit: 'PSI',
        recommendedFront: 33,
        recommendedRear: 35,
        currentFrontLeft: 31,
        currentFrontRight: 31,
        currentRearLeft: 34,
        currentRearRight: 35,
        lastCheckedDate: getRelativeDateString(-12),
        checkIntervalDays: 14,
        logs: [
          {
            id: 'log-1-1',
            timestamp: getRelativeDateString(-12) + ' 09:30',
            frontLeft: 31,
            frontRight: 31,
            rearLeft: 34,
            rearRight: 35,
            notes: 'Filled at Shell fuel station nitrogen kiosk',
          },
        ],
      },
      maintenance: {
        currentOdometerKm: 18450,
        lastServiceDate: getRelativeDateString(-90),
        lastServiceKm: 15000,
        nextServiceDueDate: getRelativeDateString(180),
        nextServiceDueKm: 25000,
      },
      serviceHistory: [
        {
          id: 'srv-1-1',
          date: getRelativeDateString(-90),
          odometerKm: 15000,
          category: 'general_service',
          serviceCenter: 'Tata Motors Authorized Service Center, Kothrud',
          cost: 4200,
          title: '15,000 KM Scheduled General Maintenance',
          description: 'Software BMS update, wheel alignment & balancing, cabin pollen air filter change, multi-point EV safety inspection.',
          invoiceNumber: 'INV-TM-2024-8491',
          nextDueKm: 25000,
          nextDueDate: getRelativeDateString(180),
        },
        {
          id: 'srv-1-2',
          date: getRelativeDateString(-210),
          odometerKm: 7500,
          category: 'battery',
          serviceCenter: 'Tata Motors Authorized EV Kiosk',
          cost: 1500,
          title: 'Auxiliary 12V Battery Check & Coolant Top-up',
          description: '12V lead-acid auxiliary battery health test (100% capacity), high-voltage coolant level topped up.',
          invoiceNumber: 'INV-TM-2023-3104',
          nextDueKm: 15000,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'veh-2',
      nickname: 'Highway Beast',
      type: 'motorcycle',
      make: 'Royal Enfield',
      model: 'Classic 350 Reborn',
      year: 2022,
      fuelType: 'Petrol',
      color: 'Halcyon Black',
      registrationNumber: 'DL 01 AB 9944',
      chassisNumber: 'ME3U3S5F0NC021873',
      engineNumber: 'U3S5F0NC04921',
      rcNumber: 'RC-DL01-2022-11492',
      puc: {
        certificateNumber: 'PUC-DL01-445821',
        issueDate: getRelativeDateString(-120),
        expiryDate: pucIn60Days,
        testingCenter: 'Indian Oil PUC Station, CP Delhi',
        emissionNorms: 'BS-VI OBD II',
        notes: 'CO level 0.12%, Hydrocarbon 84 ppm (Well within limit)',
      },
      insurance: {
        policyNumber: 'OG-23-1902-1801-00004',
        provider: 'Bajaj Allianz General Insurance',
        policyType: 'Bumper to Bumper',
        startDate: getRelativeDateString(-361),
        expiryDate: insuranceIn4Days, // Insurance expiring in 4 days alert
        idvValue: 185000,
        premiumAmount: 4200,
        emergencyHelpline: '1800 209 5858',
        notes: 'Two-wheeler comprehensive policy with RSA',
      },
      tyrePressure: {
        unit: 'PSI',
        recommendedFront: 32,
        recommendedRear: 36,
        currentFrontLeft: 32,
        currentFrontRight: 32,
        currentRearLeft: 36,
        currentRearRight: 36,
        lastCheckedDate: getRelativeDateString(-5),
        checkIntervalDays: 14,
        logs: [
          {
            id: 'log-2-1',
            timestamp: getRelativeDateString(-5) + ' 18:15',
            frontLeft: 32,
            frontRight: 32,
            rearLeft: 36,
            rearRight: 36,
            notes: 'Both tyres topped up to 32/36 PSI',
          },
        ],
      },
      maintenance: {
        currentOdometerKm: 12200,
        lastServiceDate: getRelativeDateString(-45),
        lastServiceKm: 10000,
        nextServiceDueDate: getRelativeDateString(135),
        nextServiceDueKm: 15000,
      },
      serviceHistory: [
        {
          id: 'srv-2-1',
          date: getRelativeDateString(-45),
          odometerKm: 10000,
          category: 'oil_change',
          serviceCenter: 'Royal Enfield Company Workshop, Saket',
          cost: 3200,
          title: 'Full Synthetic Engine Oil (15W-50) & Filter',
          description: 'Replaced 2.1L Motul 300V 15W-50 oil, OEM paper oil filter, drain plug washer. Chain cleaned and lubed.',
          invoiceNumber: 'RE-DEL-2024-5519',
          nextDueKm: 15000,
          nextDueDate: getRelativeDateString(135),
        },
        {
          id: 'srv-2-2',
          date: getRelativeDateString(-150),
          odometerKm: 6500,
          category: 'brakes',
          serviceCenter: 'Speedway Moto Care, Delhi',
          cost: 1650,
          title: 'Front & Rear Brake Pads Replacement',
          description: 'Installed Brembo ceramic disc brake pads. Bleeded DOT 4 brake fluid.',
          invoiceNumber: 'SMC-8821',
          nextDueKm: 16500,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export const db = {
  getVehicles(): Vehicle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        const initial = getInitialVehicles();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read vehicles from localStorage', e);
      return getInitialVehicles();
    }
  },

  saveVehicles(vehicles: Vehicle[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save vehicles to localStorage', e);
    }
  },

  getVehicleById(id: string): Vehicle | undefined {
    const list = this.getVehicles();
    return list.find((v) => v.id === id);
  },

  addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle {
    const list = this.getVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: 'veh-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newVehicle);
    this.saveVehicles(list);
    return newVehicle;
  },

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const list = this.getVehicles();
    const index = list.findIndex((v) => v.id === id);
    if (index === -1) return null;

    const updated: Vehicle = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    this.saveVehicles(list);
    return updated;
  },

  deleteVehicle(id: string): boolean {
    const list = this.getVehicles();
    const filtered = list.filter((v) => v.id !== id);
    if (filtered.length !== list.length) {
      this.saveVehicles(filtered);
      return true;
    }
    return false;
  },

  addServiceRecord(vehicleId: string, record: Omit<ServiceRecord, 'id'>): ServiceRecord | null {
    const list = this.getVehicles();
    const vehicle = list.find((v) => v.id === vehicleId);
    if (!vehicle) return null;

    const newRecord: ServiceRecord = {
      ...record,
      id: 'srv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };

    if (!vehicle.serviceHistory) {
      vehicle.serviceHistory = [];
    }
    vehicle.serviceHistory.unshift(newRecord);

    // Optionally update maintenance summary
    if (!vehicle.maintenance) {
      vehicle.maintenance = { currentOdometerKm: record.odometerKm };
    }
    vehicle.maintenance.lastServiceDate = record.date;
    vehicle.maintenance.lastServiceKm = record.odometerKm;
    if (record.odometerKm > (vehicle.maintenance.currentOdometerKm || 0)) {
      vehicle.maintenance.currentOdometerKm = record.odometerKm;
    }
    if (record.nextDueDate) {
      vehicle.maintenance.nextServiceDueDate = record.nextDueDate;
    }
    if (record.nextDueKm) {
      vehicle.maintenance.nextServiceDueKm = record.nextDueKm;
    }

    vehicle.updatedAt = new Date().toISOString();
    this.saveVehicles(list);
    return newRecord;
  },

  updateServiceRecord(vehicleId: string, recordId: string, updates: Partial<ServiceRecord>): boolean {
    const list = this.getVehicles();
    const vehicle = list.find((v) => v.id === vehicleId);
    if (!vehicle || !vehicle.serviceHistory) return false;

    const idx = vehicle.serviceHistory.findIndex((r) => r.id === recordId);
    if (idx === -1) return false;

    vehicle.serviceHistory[idx] = {
      ...vehicle.serviceHistory[idx],
      ...updates,
    };
    vehicle.updatedAt = new Date().toISOString();
    this.saveVehicles(list);
    return true;
  },

  deleteServiceRecord(vehicleId: string, recordId: string): boolean {
    const list = this.getVehicles();
    const vehicle = list.find((v) => v.id === vehicleId);
    if (!vehicle || !vehicle.serviceHistory) return false;

    const initialLen = vehicle.serviceHistory.length;
    vehicle.serviceHistory = vehicle.serviceHistory.filter((r) => r.id !== recordId);
    if (vehicle.serviceHistory.length !== initialLen) {
      vehicle.updatedAt = new Date().toISOString();
      this.saveVehicles(list);
      return true;
    }
    return false;
  },

  resetToDefault(): Vehicle[] {
    const defaults = getInitialVehicles();
    this.saveVehicles(defaults);
    return defaults;
  },

  getSettings(): AppSettings {
    try {
      const s = localStorage.getItem(SETTINGS_KEY);
      return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
    return updated;
  },

  exportDatabaseJSON(): string {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      vehicles: this.getVehicles(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDatabaseJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.vehicles)) {
        this.saveVehicles(parsed.vehicles);
        if (parsed.settings) {
          this.saveSettings(parsed.settings);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to parse import JSON', e);
      return false;
    }
  },
};
