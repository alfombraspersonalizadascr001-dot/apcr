"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("apcr_cookie_consent_v1");
      if (consent === "accepted") {
        setShow(false);
      }
    } catch {
      // In case localStorage is disabled
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("apcr_cookie_consent_v1", "accepted");
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies técnicas"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-sans">
            <p>
              En <strong className="text-white font-semibold">APCR</strong> utilizamos únicamente cookies técnicas para optimizar su experiencia de diseño y cotización, garantizando el cumplimiento de la <strong className="text-amber-300 font-medium">Ley N° 8968 (PRODHAB)</strong>. Conozca nuestra{" "}
              <Link
                href="/privacidad"
                className="text-white underline underline-offset-2 hover:text-amber-300 transition-colors"
              >
                Política de Privacidad
              </Link>{" "}
              y{" "}
              <Link
                href="/terminos"
                className="text-white underline underline-offset-2 hover:text-amber-300 transition-colors"
              >
                Términos del Servicio
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm active:scale-95 text-center"
          >
            Entendido
          </button>
          <button
            onClick={handleAccept}
            aria-label="Cerrar aviso"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
