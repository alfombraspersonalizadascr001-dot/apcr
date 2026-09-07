"use client";

import { useState, useEffect } from 'react';
import { AirlockPortal } from './components/AirlockPortal';
import { ProductsPage } from './components/ProductsPage';
import { SoftwarePage } from './components/SoftwarePage';
import { LogoShowcaseModal } from './components/LogoShowcaseModal';
import { airlockAudio } from './utils/airlockSound';
import type { ViewMode } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('portal');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      if (page === 'software' || page === 'digital' || window.location.hash.includes('software')) {
        setViewMode('digital');
      } else if (page === 'productos' || page === 'physical' || window.location.hash.includes('producto')) {
        setViewMode('physical');
      } else if (page === 'logos' || window.location.hash.includes('logo')) {
        setViewMode('logos');
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || params.get('view');
        if (page === 'software' || page === 'digital') {
          setViewMode('digital');
        } else if (page === 'productos' || page === 'physical') {
          setViewMode('physical');
        } else if (page === 'logos') {
          setViewMode('logos');
        } else {
          setViewMode('portal');
        }
      } catch {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleReturnToPortal = () => {
    try {
      airlockAudio.playAirlockClose();
    } catch {}
    setViewMode('portal');
    if (typeof window !== 'undefined' && window.history.pushState) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 select-none font-sans">
      {/* 1. PORTAL DE ENTRADA (PUERTAS CON VISOR VR) */}
      {viewMode === 'portal' && (
        <AirlockPortal 
          currentWorld={viewMode}
          lang={lang}
          onToggleLang={(l) => setLang(l)}
          onEnterWorld={(world) => {
            setViewMode(world);
            if (typeof window !== 'undefined' && window.history.pushState) {
              if (world === 'physical') {
                window.history.pushState(null, '', '?page=productos');
              } else if (world === 'digital') {
                window.history.pushState(null, '', '?page=software');
              }
            }
          }}
          onReturnToPortal={handleReturnToPortal}
        />
      )}

      {/* 2. PÁGINA DE PRODUCTOS // ESTILO HP */}
      {viewMode === 'physical' && (
        <ProductsPage
          onReturnToPortal={handleReturnToPortal}
          lang={lang}
          onToggleLang={(l) => setLang(l)}
        />
      )}

      {/* VISTA DE PRUEBAS DE LOGO (4 COLORES) */}
      {viewMode === 'logos' && (
        <LogoShowcaseModal onClose={handleReturnToPortal} />
      )}

      {/* 3. PÁGINA DE SOFTWARE // ESTILO MICROSOFT COSTA RICA */}
      {viewMode === 'digital' && (
        <SoftwarePage
          onReturnToPortal={handleReturnToPortal}
          lang={lang}
          onToggleLang={(l) => setLang(l)}
        />
      )}
    </div>
  );
}
