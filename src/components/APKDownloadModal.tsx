import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  QrCode,
  CheckCircle2,
  Package,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDirectInstall?: () => void;
  isInstallable?: boolean;
}

export const APKDownloadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDirectInstall,
  isInstallable,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // The shared app URL
  const appUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.href
      : 'https://ais-pre-ztpravhgh2gbovp3zcld2y-145324817647.asia-east1.run.app';

  useEffect(() => {
    QRCode.toDataURL(appUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [appUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    appUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Get AutoVault on Android
              </h3>
              <p className="text-xs text-slate-400">Install directly or generate APK file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* METHOD 1: RECOMMENDED ANDROID WEBAPK (OFFICIAL GOOGLE ANDROID STANDARD) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-900 border-2 border-teal-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Method 1: Direct Android Install (Recommended)
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Google Play WebAPK
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Android includes built-in <strong>WebAPK</strong> support. When you open this app in Google Chrome on your phone, Google Play Services generates and installs an authentic native APK directly onto your phone!
            </p>

            {/* QR Code and Direct Install */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              {qrDataUrl && (
                <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                  <img src={qrDataUrl} alt="Scan QR code" className="w-28 h-28" />
                </div>
              )}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-white block">
                  Scan QR with your Android camera:
                </span>
                <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>Scan the QR code to open on your phone</li>
                  <li>Tap <strong>"Install App"</strong> in the header or Chrome menu</li>
                  <li>Android will install the APK to your home screen!</li>
                </ol>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-[11px] border border-teal-500/30 flex items-center gap-1 transition"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Link Copied!' : 'Copy Phone Link'}</span>
                  </button>

                  {isInstallable && onDirectInstall && (
                    <button
                      onClick={onDirectInstall}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition shadow-sm"
                    >
                      Install on this Device
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* METHOD 2: PWABUILDER 1-CLICK APK FILE GENERATION */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                Method 2: Standalone .APK File
              </span>
              <span className="text-xs text-slate-400">For sideloading / testing</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you specifically want a downloadable <strong>.apk</strong> or <strong>.aab</strong> file for manual file sharing or sideloading, you can package this compliant PWA instantly using <strong>PWABuilder</strong> (maintained by Microsoft & Google):
            </p>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Your PWA URL:</span>
                <span className="font-mono text-[10px] text-teal-400 truncate max-w-[200px]">
                  {appUrl}
                </span>
              </div>

              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Open PWABuilder to Download APK</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              <p className="text-[10px] text-slate-400 text-center leading-normal">
                Click "Package for Android" inside PWABuilder to generate the signed APK directly.
              </p>
            </div>
          </div>

          {/* SYSTEM DETAILS & CAPABILITIES */}
          <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Native Android Features Included:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Web Push & Alert Chime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Haptic Vibration Feedback</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Offline Local Database</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Standalone Fullscreen App</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
