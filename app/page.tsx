"use client";

import { useState, useEffect } from 'react';
import { AirlockPortal } from './components/AirlockPortal';
import { MinimalistPortal } from './components/MinimalistPortal';
import { ProductsPage } from './components/ProductsPage';
import { SoftwarePage } from './components/SoftwarePage';
import { LogoShowcaseModal } from './components/LogoShowcaseModal';
import { airlockAudio } from './utils/airlockSound';
import type { ViewMode } from './types';

export type PortalTheme = 'minimal' | 'airlock';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('portal');
  const [portalTheme, setPortalTheme] = useState<PortalTheme>('minimal');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('view');
      const themeParam = params.get('v') || params.get('theme') || params.get('portal');

      // 1. Check portal theme preference: URL param overrides localStorage
      if (themeParam === 'airlock' || themeParam === 'minimal') {
        setPortalTheme(themeParam as PortalTheme);
      } else {
        const savedTheme = localStorage.getItem('apcr_home_theme') as PortalTheme;
        if (savedTheme === 'airlock' || savedTheme === 'minimal') {
          setPortalTheme(savedTheme);
        }
      }

      // 2. Check inner navigation
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
        const themeParam = params.get('v') || params.get('theme') || params.get('portal');

        if (themeParam === 'airlock' || themeParam === 'minimal') {
          setPortalTheme(themeParam as PortalTheme);
        }

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
      // Preserve ?v= parameter if present
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      const newUrl = v ? `?v=${v}` : window.location.pathname;
      window.history.pushState(null, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterWorld = (world: 'physical' | 'digital') => {
    setViewMode(world);
    if (typeof window !== 'undefined' && window.history.pushState) {
      const pageParam = world === 'physical' ? 'productos' : 'software';
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      const newUrl = v ? `?page=${pageParam}&v=${v}` : `?page=${pageParam}`;
      window.history.pushState(null, '', newUrl);
    }
  };

  const isLightPortal = viewMode === 'portal' && portalTheme !== 'airlock';

  return (
    <div className={`min-h-screen select-none font-sans transition-colors duration-500 ${
      isLightPortal ? 'bg-[#F8F9FA] text-[#111114]' : 'bg-[#070709] text-slate-100'
    }`}>
      {/* 1. PORTALES DE ENTRADA (MINIMALISTA OBSIDIAN O ESCLUSA VR AIRLOCK) */}
      {viewMode === 'portal' && (
        portalTheme === 'airlock' ? (
          <AirlockPortal 
            currentWorld={viewMode}
            lang={lang}
            onToggleLang={(l) => setLang(l)}
            onEnterWorld={handleEnterWorld}
            onReturnToPortal={handleReturnToPortal}
          />
        ) : (
          <MinimalistPortal 
            currentWorld={viewMode}
            lang={lang}
            onToggleLang={(l) => setLang(l)}
            onEnterWorld={handleEnterWorld}
            onReturnToPortal={handleReturnToPortal}
          />
        )
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
