import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { APKDownloadModal } from './APKDownloadModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowModal(true);
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
        title="Install Android App or Download APK"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install / APK</span>
      </button>

      <APKDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDirectInstall={install}
        isInstallable={isInstallable}
      />
    </>
  );
};

