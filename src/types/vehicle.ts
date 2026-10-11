export type VehicleType = 'car' | 'motorcycle' | 'scooter' | 'suv' | 'commercial';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';

export interface PUCCertificate {
  certificateNumber: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  testingCenter: string;
  emissionNorms?: string; // BS-VI, BS-IV, etc.
  notes?: string;
}

export interface InsurancePolicy {
  policyNumber: string;
  provider: string; // ICICI Lombard, HDFC Ergo, etc.
  policyType: 'Comprehensive' | 'Zero Dep' | 'Third Party' | 'Bumper to Bumper';
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  idvValue?: number;
  premiumAmount?: number;
  emergencyHelpline?: string;
  notes?: string;
}

export interface TyrePressureLog {
  id: string;
  timestamp: string;
  frontLeft: number;
  frontRight: number;
  rearLeft?: number;
  rearRight?: number;
  notes?: string;
}

export interface TyrePressureConfig {
  unit: 'PSI' | 'BAR';
  recommendedFront: number; // e.g., 32 PSI
  recommendedRear: number; // e.g., 35 PSI
  currentFrontLeft: number;
  currentFrontRight: number;
  currentRearLeft: number; // For 4-wheelers
  currentRearRight: number; // For 4-wheelers
  lastCheckedDate: string; // YYYY-MM-DD
  checkIntervalDays: number; // e.g., 14 days
  logs: TyrePressureLog[];
}

export type ServiceCategory =
  | 'oil_change'
  | 'general_service'
  | 'battery'
  | 'brakes'
  | 'tyres'
  | 'filter_change'
  | 'coolant'
  | 'chain_sprocket'
  | 'electrical'
  | 'suspension'
  | 'other';

export interface ServiceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  odometerKm: number;
  category: ServiceCategory;
  serviceCenter: string; // Workshop / Garage name
  cost: number; // ₹ amount
  title: string; // e.g., "Engine Oil & Filter Replacement"
  description?: string; // items replaced, technician remarks
  invoiceNumber?: string;
  nextDueKm?: number;
  nextDueDate?: string;
}

export interface MaintenanceRecord {
  currentOdometerKm: number;
  lastServiceDate?: string;
  lastServiceKm?: number;
  nextServiceDueDate?: string;
  nextServiceDueKm?: number;
}

export interface Vehicle {
  id: string;
  nickname: string;
  type: VehicleType;
  make: string; // e.g., Tata, Hyundai, Royal Enfield
  model: string; // e.g., Nexon EV, Creta, Classic 350
  year: number;
  fuelType: FuelType;
  color?: string;
  registrationNumber: string; // e.g., MH 12 AB 1234
  chassisNumber: string; // VIN
  engineNumber: string;
  rcNumber?: string;
  puc: PUCCertificate;
  insurance: InsurancePolicy;
  tyrePressure: TyrePressureConfig;
  maintenance?: MaintenanceRecord;
  serviceHistory?: ServiceRecord[];
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface VehicleAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  type: 'puc_expiring' | 'puc_expired' | 'insurance_expiring' | 'insurance_expired' | 'pressure_overdue' | 'service_due';
  title: string;
  message: string;
  daysRemaining: number;
  severity: AlertSeverity;
  dueDate: string;
  timestamp: string;
  dismissed?: boolean;
}
