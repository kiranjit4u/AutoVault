import React, { useState } from 'react';
import { Vehicle, ServiceRecord, ServiceCategory } from '../types/vehicle';
import { getTodayString, getRelativeDateString } from '../services/db';
import {
  X,
  Wrench,
  Check,
  Calendar,
  Gauge,
  CircleDollarSign,
  FileText,
  Building2,
  Droplet,
  BatteryCharging,
  Disc,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface Props {
  vehicle: Vehicle | null;
  initialRecord?: ServiceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleId: string, record: Omit<ServiceRecord, 'id'>, recordId?: string) => void;
}

export const AddEditServiceModal: React.FC<Props> = ({
  vehicle,
  initialRecord,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !vehicle) return null;

  const isEdit = !!initialRecord;
  const today = getTodayString();

  const [date, setDate] = useState(initialRecord?.date || today);
  const [odometerKm, setOdometerKm] = useState<number>(
    initialRecord?.odometerKm || vehicle.maintenance?.currentOdometerKm || 15000
  );
  const [category, setCategory] = useState<ServiceCategory>(
    initialRecord?.category || (vehicle.fuelType === 'Electric' ? 'general_service' : 'oil_change')
  );
  const [title, setTitle] = useState(initialRecord?.title || '');
  const [serviceCenter, setServiceCenter] = useState(
    initialRecord?.serviceCenter || `${vehicle.make} Authorized Service Center`
  );
  const [cost, setCost] = useState<number>(initialRecord?.cost || 3500);
  const [description, setDescription] = useState(initialRecord?.description || '');
  const [invoiceNumber, setInvoiceNumber] = useState(initialRecord?.invoiceNumber || '');
  const [nextDueKm, setNextDueKm] = useState<number | undefined>(
    initialRecord?.nextDueKm || (initialRecord?.odometerKm ? initialRecord.odometerKm + 10000 : undefined)
  );
  const [nextDueDate, setNextDueDate] = useState<string>(
    initialRecord?.nextDueDate || getRelativeDateString(180)
  );

  const categories: { key: ServiceCategory; label: string; icon: string; defaultTitle: string }[] = [
    { key: 'oil_change', label: 'Oil Change', icon: '🛢️', defaultTitle: 'Engine Oil & Filter Replacement' },
    { key: 'general_service', label: 'General Service', icon: '🔧', defaultTitle: 'Periodic Scheduled Maintenance' },
    { key: 'battery', label: 'Battery', icon: '🔋', defaultTitle: 'Battery Inspection / Replacement' },
    { key: 'brakes', label: 'Brakes', icon: '🛑', defaultTitle: 'Brake Pads & Fluid Service' },
    { key: 'tyres', label: 'Tyres / Alignment', icon: '🛞', defaultTitle: 'Wheel Alignment & Balancing' },
    { key: 'filter_change', label: 'Filters', icon: '💨', defaultTitle: 'Air & Cabin AC Filter Replacement' },
    { key: 'coolant', label: 'Coolant / Fluids', icon: '🧪', defaultTitle: 'Radiator Coolant Flush & Top-Up' },
    { key: 'chain_sprocket', label: 'Chain / Drive', icon: '⚙️', defaultTitle: 'Drive Chain Cleaning & Lube' },
    { key: 'electrical', label: 'Electrical', icon: '⚡', defaultTitle: 'Electrical Inspection / Lights' },
    { key: 'suspension', label: 'Suspension', icon: '🔩', defaultTitle: 'Shock Absorber & Suspension Check' },
    { key: 'other', label: 'Other Repair', icon: '🛠️', defaultTitle: 'Mechanical Repair / Part Replacement' },
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    setCategory(cat.key);
    if (!title || categories.some((c) => c.defaultTitle === title)) {
      setTitle(cat.defaultTitle);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a service title');
      return;
    }

    onSave(
      vehicle.id,
      {
        date,
        odometerKm: Number(odometerKm) || 0,
        category,
        title: title.trim(),
        serviceCenter: serviceCenter.trim() || 'Independent Workshop',
        cost: Number(cost) || 0,
        description: description.trim(),
        invoiceNumber: invoiceNumber.trim(),
        nextDueKm: nextDueKm ? Number(nextDueKm) : undefined,
        nextDueDate: nextDueDate || undefined,
      },
      initialRecord?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {isEdit ? 'Edit Maintenance Record' : 'Log Maintenance & Service'}
              </h3>
              <p className="text-xs text-slate-400">
                {vehicle.nickname} • <span className="font-mono">{vehicle.registrationNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Category Selector Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Maintenance Type:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1 bg-slate-950 rounded-2xl border border-slate-800">
              {categories.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Service Title / Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Engine Oil & Oil Filter Replacement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Date and Odometer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Date of Service *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span>Odometer at Service (KM) *</span>
              </label>
              <input
                type="number"
                required
                value={odometerKm}
                onChange={(e) => setOdometerKm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Workshop & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Workshop / Service Center</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tata Motors Service, Bosch Center"
                value={serviceCenter}
                onChange={(e) => setServiceCenter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <CircleDollarSign className="w-3.5 h-3.5 text-teal-400" />
                <span>Total Bill Amount (₹) *</span>
              </label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-teal-500/60 font-mono text-white text-xs font-bold focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Invoice Number & Technician Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Invoice / Bill Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. INV-2024-9982"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Parts Replaced & Work Done (Notes)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Synthetic 5W-30 oil (3.5L), new oil filter, spark plugs cleaned, brake fluid topped up."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          {/* Next Service Due Targets */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
              Next Service Reminder Targets
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Next Service Due (KM)</label>
                <input
                  type="number"
                  placeholder="e.g. 25000"
                  value={nextDueKm || ''}
                  onChange={(e) => setNextDueKm(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Next Due Date</label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isEdit ? 'Update Record' : 'Save Service Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
