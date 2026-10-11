import React, { useState, useEffect, useMemo } from 'react';
import { Vehicle, VehicleAlert, ServiceRecord } from './types/vehicle';
import { db } from './services/db';
import { notificationService, triggerHaptic, playAndroidChime } from './services/notifications';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNotificationBanner } from './components/AndroidNotificationBanner';
import { VehicleCard } from './components/VehicleCard';
import { AddEditVehicleModal } from './components/AddEditVehicleModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { RenewPUCModal } from './components/RenewPUCModal';
import { RenewInsuranceModal } from './components/RenewInsuranceModal';
import { AddEditServiceModal } from './components/AddEditServiceModal';
import { QuickLogPressureModal } from './components/QuickLogPressureModal';
import { PUCAlertsCenter } from './components/PUCAlertsCenter';
import { TyrePressureStation } from './components/TyrePressureStation';
import { DocumentVault } from './components/DocumentVault';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  Car,
  Bell,
  Gauge,
  FolderLock,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Smartphone,
  ShieldCheck,
  Shield,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => db.getVehicles());
  const [activeTab, setActiveTab] = useState<'garage' | 'alerts' | 'pressure' | 'vault'>('garage');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [pucRenewVehicle, setPucRenewVehicle] = useState<Vehicle | null>(null);
  const [isRenewOpen, setIsRenewOpen] = useState(false);

  const [insuranceRenewVehicle, setInsuranceRenewVehicle] = useState<Vehicle | null>(null);
  const [isInsuranceRenewOpen, setIsInsuranceRenewOpen] = useState(false);

  const [serviceVehicle, setServiceVehicle] = useState<Vehicle | null>(null);
  const [editingServiceRecord, setEditingServiceRecord] = useState<ServiceRecord | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [pressureVehicle, setPressureVehicle] = useState<Vehicle | null>(null);
  const [isPressureOpen, setIsPressureOpen] = useState(false);

  // Heads-up Android notification banner state
  const [activeBannerAlert, setActiveBannerAlert] = useState<VehicleAlert | null>(null);

  // Phone frame wrapper toggle for desktop viewing convenience
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Evaluate alerts
  const alerts = useMemo(() => {
    return notificationService.evaluateAllAlerts(vehicles);
  }, [vehicles]);

  const pucAlertsCount = useMemo(() => {
    return alerts.filter((a) => a.type === 'puc_expiring' || a.type === 'puc_expired').length;
  }, [alerts]);

  const insuranceAlertsCount = useMemo(() => {
    return alerts.filter((a) => a.type === 'insurance_expiring' || a.type === 'insurance_expired').length;
  }, [alerts]);

  const totalExpirationAlertsCount = pucAlertsCount + insuranceAlertsCount;

  // Initial check on mount
  useEffect(() => {
    // Run automated push alert check
    const evaluated = notificationService.checkAndTriggerPushAlerts(vehicles);

    // Show top heads-up banner for highest priority PUC or Insurance alert on launch
    const urgentAlert = evaluated.find(
      (a) =>
        a.type === 'puc_expiring' ||
        a.type === 'puc_expired' ||
        a.type === 'insurance_expiring' ||
        a.type === 'insurance_expired'
    );
    if (urgentAlert) {
      setActiveBannerAlert(urgentAlert);
    }
  }, []);

  const refreshVehicles = () => {
    const list = db.getVehicles();
    setVehicles([...list]);
  };

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingVehicle) {
      db.updateVehicle(editingVehicle.id, vehicleData);
    } else {
      db.addVehicle(vehicleData);
    }
    refreshVehicles();
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    db.deleteVehicle(vehicleId);
    refreshVehicles();
    if (selectedVehicle?.id === vehicleId) {
      setIsDetailOpen(false);
      setSelectedVehicle(null);
    }
  };

  const handleSavePUC = (vehicleId: string, updatedPuc: Vehicle['puc']) => {
    db.updateVehicle(vehicleId, { puc: updatedPuc });
    refreshVehicles();
    triggerHaptic();
    // Dismiss banner if this was the alert
    if (activeBannerAlert?.vehicleId === vehicleId) {
      setActiveBannerAlert(null);
    }
  };

  const handleSaveInsurance = (vehicleId: string, updatedInsurance: Vehicle['insurance']) => {
    db.updateVehicle(vehicleId, { insurance: updatedInsurance });
    refreshVehicles();
    triggerHaptic();
    if (activeBannerAlert?.vehicleId === vehicleId) {
      setActiveBannerAlert(null);
    }
  };

  const handleSavePressure = (vehicleId: string, updatedConfig: Vehicle['tyrePressure']) => {
    db.updateVehicle(vehicleId, { tyrePressure: updatedConfig });
    refreshVehicles();
    triggerHaptic();
  };

  const handleSaveServiceRecord = (
    vehicleId: string,
    recordData: Omit<ServiceRecord, 'id'>,
    recordId?: string
  ) => {
    if (recordId) {
      db.updateServiceRecord(vehicleId, recordId, recordData);
    } else {
      db.addServiceRecord(vehicleId, recordData);
    }
    refreshVehicles();
    const updated = db.getVehicleById(vehicleId);
    if (updated && selectedVehicle?.id === vehicleId) {
      setSelectedVehicle(updated);
    }
    triggerHaptic();
  };

  const handleDeleteServiceRecord = (vehicle: Vehicle, recordId: string) => {
    db.deleteServiceRecord(vehicle.id, recordId);
    refreshVehicles();
    const updated = db.getVehicleById(vehicle.id);
    if (updated && selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(updated);
    }
    triggerHaptic();
  };

  // Test trigger dispatches actual push notification, sound chime, vibration, and banner
  const triggerManualTestAlert = (type: 'puc' | 'insurance' = 'puc') => {
    if (type === 'insurance') {
      const urgentIns = alerts.find(
        (a) => a.type === 'insurance_expiring' || a.type === 'insurance_expired'
      ) || {
        id: 'test-ins-alert-' + Date.now(),
        vehicleId: vehicles[1]?.id || vehicles[0]?.id || 'v2',
        vehicleName: vehicles[1]?.nickname || 'Royal Enfield Classic 350',
        registrationNumber: vehicles[1]?.registrationNumber || 'DL 01 AB 9944',
        type: 'insurance_expiring',
        title: '🛡️ Insurance Expiring in 4 Days!',
        message: `${vehicles[1]?.nickname || 'Royal Enfield'} (${vehicles[1]?.registrationNumber || 'DL 01 AB 9944'}) insurance policy expires on ${vehicles[1]?.insurance.expiryDate || 'soon'}. Renew to keep coverage active.`,
        daysRemaining: 4,
        severity: 'warning',
        dueDate: vehicles[1]?.insurance.expiryDate || '2026-10-15',
        timestamp: new Date().toISOString(),
      };

      setActiveBannerAlert(urgentIns as VehicleAlert);
      notificationService.sendPushNotification(
        urgentIns.title,
        urgentIns.message,
        'test-ins-' + Date.now()
      );
    } else {
      const urgentPUC = alerts.find(
        (a) => a.type === 'puc_expiring' || a.type === 'puc_expired'
      ) || {
        id: 'test-puc-alert-' + Date.now(),
        vehicleId: vehicles[0]?.id || 'v1',
        vehicleName: vehicles[0]?.nickname || 'Tata Nexon EV',
        registrationNumber: vehicles[0]?.registrationNumber || 'MH 12 QW 5678',
        type: 'puc_expiring',
        title: '⚠️ PUC Expiring in 3 Days!',
        message: `${vehicles[0]?.nickname || 'Tata Nexon EV'} (${vehicles[0]?.registrationNumber || 'MH 12 QW 5678'}) PUC certificate is near expiry. Please renew to avoid fines.`,
        daysRemaining: 3,
        severity: 'warning',
        dueDate: vehicles[0]?.puc.expiryDate || '2026-10-14',
        timestamp: new Date().toISOString(),
      };

      setActiveBannerAlert(urgentPUC as VehicleAlert);
      notificationService.sendPushNotification(
        urgentPUC.title,
        urgentPUC.message,
        'test-puc-' + Date.now()
      );
    }
  };

  // Filtered vehicle list for Garage
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'puc_alert') {
      const hasPucAlert = alerts.find((a) => a.vehicleId === v.id && (a.type === 'puc_expiring' || a.type === 'puc_expired'));
      return !!hasPucAlert;
    }
    if (filterType === 'insurance_alert') {
      const hasInsAlert = alerts.find((a) => a.vehicleId === v.id && (a.type === 'insurance_expiring' || a.type === 'insurance_expired'));
      return !!hasInsAlert;
    }
    if (filterType === '2wheeler') return v.type === 'motorcycle' || v.type === 'scooter';
    if (filterType === '4wheeler') return v.type === 'car' || v.type === 'suv' || v.type === 'commercial';
    return true;
  });

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-start ${
      isPhoneFrame ? 'py-4 sm:py-8' : ''
    }`}>
      {/* Android Device Shell Container */}
      <div className={`w-full bg-slate-950 text-slate-100 flex flex-col min-h-screen transition-all relative ${
        isPhoneFrame
          ? 'max-w-[430px] rounded-[44px] border-[10px] border-slate-900 shadow-2xl shadow-cyan-950/40 overflow-hidden min-h-[880px]'
          : 'max-w-xl mx-auto'
      }`}>
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Heads-up Alert Banner */}
        <AndroidNotificationBanner
          alert={activeBannerAlert}
          onDismiss={() => setActiveBannerAlert(null)}
          onViewVehicle={(vId) => {
            const v = vehicles.find((item) => item.id === vId);
            if (v) {
              setSelectedVehicle(v);
              setIsDetailOpen(true);
            }
          }}
          onRenewPUC={(vId) => {
            const v = vehicles.find((item) => item.id === vId);
            if (v) {
              setPucRenewVehicle(v);
              setIsRenewOpen(true);
            }
          }}
          onRenewInsurance={(vId) => {
            const v = vehicles.find((item) => item.id === vId);
            if (v) {
              setInsuranceRenewVehicle(v);
              setIsInsuranceRenewOpen(true);
            }
          }}
        />

        {/* Top App Header */}
        <header className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-900 backdrop-blur-md sticky top-[33px] z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black tracking-tight text-white leading-none">
                  AutoVault
                </h1>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Android
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Local Vehicle & Expiration Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PWAInstallButton />

            {/* Frame toggle button for desktop testing */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition text-xs"
              title={isPhoneFrame ? 'Full Width View' : 'Android Device Frame View'}
            >
              <Smartphone className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-4 pb-28 overflow-y-auto">
          {/* TAB 1: GARAGE */}
          {activeTab === 'garage' && (
            <div className="space-y-4">
              {/* Urgent Expiry Alert banner trigger pill if PUC or Insurance alerts exist */}
              {totalExpirationAlertsCount > 0 && (
                <div
                  onClick={() => setActiveTab('alerts')}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-amber-500/20 border border-teal-500/40 flex items-center justify-between cursor-pointer hover:border-teal-400 transition animate-in fade-in"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{totalExpirationAlertsCount} Expiration Alert{totalExpirationAlertsCount > 1 ? 's' : ''} Active!</span>
                        <span className="text-[10px] text-teal-300 bg-teal-500/20 px-1.5 py-0.5 rounded font-mono">
                          {pucAlertsCount} PUC • {insuranceAlertsCount} Ins
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Expiring soon. Tap to review Expiration Radar.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-400 underline">View →</span>
                </div>
              )}

              {/* Search & Filter bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by nickname, plate, or model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition"
                  />
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                    filterType === 'all'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({vehicles.length})
                </button>
                <button
                  onClick={() => setFilterType('insurance_alert')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                    filterType === 'insurance_alert'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-teal-300 hover:text-teal-200 border border-teal-500/30'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>Ins Alerts ({insuranceAlertsCount})</span>
                </button>
                <button
                  onClick={() => setFilterType('puc_alert')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                    filterType === 'puc_alert'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>PUC Alerts ({pucAlertsCount})</span>
                </button>
                <button
                  onClick={() => setFilterType('4wheeler')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                    filterType === '4wheeler'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Cars & SUVs
                </button>
                <button
                  onClick={() => setFilterType('2wheeler')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                    filterType === '2wheeler'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Bikes & Scooters
                </button>
              </div>

              {/* Vehicle Cards Grid */}
              <div className="space-y-3.5">
                {filteredVehicles.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                    <Car className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No vehicles match your filter.</p>
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setSearchQuery('');
                      }}
                      className="text-xs text-teal-400 hover:underline font-semibold"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onSelect={(v) => {
                        setSelectedVehicle(v);
                        setIsDetailOpen(true);
                      }}
                      onEdit={(v) => {
                        setEditingVehicle(v);
                        setIsAddEditOpen(true);
                      }}
                      onDelete={handleDeleteVehicle}
                      onQuickLogPressure={(v) => {
                        setPressureVehicle(v);
                        setIsPressureOpen(true);
                      }}
                      onRenewPUC={(v) => {
                        setPucRenewVehicle(v);
                        setIsRenewOpen(true);
                      }}
                      onRenewInsurance={(v) => {
                        setInsuranceRenewVehicle(v);
                        setIsInsuranceRenewOpen(true);
                      }}
                      onAddService={(v) => {
                        setServiceVehicle(v);
                        setEditingServiceRecord(null);
                        setIsServiceModalOpen(true);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ALERTS & EXPIRATION RADAR */}
          {activeTab === 'alerts' && (
            <PUCAlertsCenter
              vehicles={vehicles}
              alerts={alerts}
              onRenewPUC={(v) => {
                setPucRenewVehicle(v);
                setIsRenewOpen(true);
              }}
              onRenewInsurance={(v) => {
                setInsuranceRenewVehicle(v);
                setIsInsuranceRenewOpen(true);
              }}
              onSelectVehicle={(v) => {
                setSelectedVehicle(v);
                setIsDetailOpen(true);
              }}
              onTriggerTestAlert={triggerManualTestAlert}
            />
          )}

          {/* TAB 3: TYRE PRESSURE STATION */}
          {activeTab === 'pressure' && (
            <TyrePressureStation
              vehicles={vehicles}
              onLogPressure={(v) => {
                setPressureVehicle(v);
                setIsPressureOpen(true);
              }}
            />
          )}

          {/* TAB 4: DOCUMENT VAULT & CHASSIS/ENGINE REGISTRY */}
          {activeTab === 'vault' && (
            <DocumentVault vehicles={vehicles} onReload={refreshVehicles} />
          )}
        </main>

        {/* Floating Action Button (FAB) for adding vehicle */}
        {activeTab === 'garage' && (
          <button
            onClick={() => {
              setEditingVehicle(null);
              setIsAddEditOpen(true);
            }}
            className="fixed bottom-20 right-5 sm:right-8 z-30 flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-teal-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Add Vehicle</span>
          </button>
        )}

        {/* Android Material Bottom Navigation Bar */}
        <nav className="fixed bottom-0 inset-x-0 max-w-xl mx-auto bg-slate-950/95 border-t border-slate-900/90 backdrop-blur-xl z-40 px-3 py-2 flex items-center justify-around">
          {/* Garage */}
          <button
            onClick={() => setActiveTab('garage')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'garage' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition ${
              activeTab === 'garage' ? 'bg-teal-500/20 text-teal-400' : ''
            }`}>
              <Car className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Garage</span>
          </button>

          {/* Alerts & Expiration Radar */}
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition relative cursor-pointer ${
              activeTab === 'alerts' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition relative ${
              activeTab === 'alerts' ? 'bg-teal-500/20 text-teal-400' : ''
            }`}>
              <Bell className="w-5 h-5" />
              {totalExpirationAlertsCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-slate-950 animate-ping"></span>
              )}
              {totalExpirationAlertsCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-slate-950"></span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Alerts</span>
          </button>

          {/* Tyre Pressure */}
          <button
            onClick={() => setActiveTab('pressure')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'pressure' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition ${
              activeTab === 'pressure' ? 'bg-teal-500/20 text-teal-400' : ''
            }`}>
              <Gauge className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Tyres</span>
          </button>

          {/* Vault */}
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
              activeTab === 'vault' ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition ${
              activeTab === 'vault' ? 'bg-teal-500/20 text-teal-400' : ''
            }`}>
              <FolderLock className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Vault & IDs</span>
          </button>
        </nav>
      </div>

      {/* MODALS */}
      {/* 1. Add / Edit Vehicle Modal */}
      <AddEditVehicleModal
        isOpen={isAddEditOpen}
        initialVehicle={editingVehicle}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingVehicle(null);
        }}
        onSave={handleSaveVehicle}
      />

      {/* 2. Vehicle Full Detail View Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedVehicle(null);
        }}
        onEdit={(v) => {
          setIsDetailOpen(false);
          setEditingVehicle(v);
          setIsAddEditOpen(true);
        }}
        onRenewPUC={(v) => {
          setPucRenewVehicle(v);
          setIsRenewOpen(true);
        }}
        onRenewInsurance={(v) => {
          setInsuranceRenewVehicle(v);
          setIsInsuranceRenewOpen(true);
        }}
        onLogPressure={(v) => {
          setPressureVehicle(v);
          setIsPressureOpen(true);
        }}
        onAddService={(v) => {
          setServiceVehicle(v);
          setEditingServiceRecord(null);
          setIsServiceModalOpen(true);
        }}
        onEditService={(v, record) => {
          setServiceVehicle(v);
          setEditingServiceRecord(record);
          setIsServiceModalOpen(true);
        }}
        onDeleteService={handleDeleteServiceRecord}
      />

      {/* 3. Renew PUC Certificate Modal */}
      <RenewPUCModal
        vehicle={pucRenewVehicle}
        isOpen={isRenewOpen}
        onClose={() => {
          setIsRenewOpen(false);
          setPucRenewVehicle(null);
        }}
        onSavePUC={handleSavePUC}
      />

      {/* 4. Renew Insurance Policy Modal */}
      <RenewInsuranceModal
        vehicle={insuranceRenewVehicle}
        isOpen={isInsuranceRenewOpen}
        onClose={() => {
          setIsInsuranceRenewOpen(false);
          setInsuranceRenewVehicle(null);
        }}
        onSaveInsurance={handleSaveInsurance}
      />

      {/* 5. Add / Edit Service Record Modal */}
      <AddEditServiceModal
        vehicle={serviceVehicle}
        initialRecord={editingServiceRecord}
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingServiceRecord(null);
        }}
        onSave={handleSaveServiceRecord}
      />

      {/* 6. Quick Log Tyre Pressure Modal */}
      <QuickLogPressureModal
        vehicle={pressureVehicle}
        isOpen={isPressureOpen}
        onClose={() => {
          setIsPressureOpen(false);
          setPressureVehicle(null);
        }}
        onSavePressure={handleSavePressure}
      />
    </div>
  );
}
