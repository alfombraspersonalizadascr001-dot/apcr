"use client";

import { useState } from 'react';
import { AirlockPortal } from './components/AirlockPortal';
import { ProductsPage } from './components/ProductsPage';
import { SoftwarePage } from './components/SoftwarePage';
import { LogoShowcaseModal } from './components/LogoShowcaseModal';
import { airlockAudio } from './utils/airlockSound';
import type { ViewMode } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'logos' || params.get('page') === 'logos' || window.location.hash.includes('logo')) {
        return 'logos';
      }
      if (params.get('view') === 'productos' || params.get('page') === 'productos' || window.location.hash.includes('producto')) {
        return 'physical';
      }
      if (params.get('view') === 'software' || params.get('page') === 'software' || window.location.hash.includes('software')) {
        return 'digital';
      }
    }
    return 'portal';
  });
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const handleReturnToPortal = () => {
    airlockAudio.playAirlockClose();
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

