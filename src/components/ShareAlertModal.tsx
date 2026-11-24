import React, { useState } from "react";
import { Share2, Copy, Check, ExternalLink, X, Send } from "lucide-react";

interface ShareAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAlertModal: React.FC<ShareAlertModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href;
  const shareText = "🚨 Agusan River Flood Monitoring & Evacuation Advisory for Butuan City. Check live water gauge telemetry, evacuation routes, and safety protocols:";

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Agusan River Flood Monitoring System",
          text: shareText,
          url: appUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in zoom-in-95 duration-200 my-auto">
        <button
          onClick={onClose}
          aria-label="Close Share Flood Advisory Modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="share-modal-title" className="text-xl font-extrabold text-slate-900">Share Flood Advisory</h3>
            <p className="text-xs text-slate-500">Broadcast safety status & live map link</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Preview Message</span>
          <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
            "{shareText} {appUrl}"
          </p>
        </div>

        <div className="space-y-3">
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Device Menu</span>
            </button>
          )}

          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <span>Twitter / X</span>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <span>Facebook</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + appUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopyLink}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy App Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
