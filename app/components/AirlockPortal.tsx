"use client";

import React, { useState, useEffect, useRef } from 'react';
import { airlockAudio } from '../utils/airlockSound';
import { 
  Volume2, 
  VolumeX, 
  Cpu, 
  Layers, 
  ArrowRight,
  X,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface AirlockPortalProps {
  onEnterWorld: (world: 'physical' | 'digital') => void;
  currentWorld?: 'portal' | 'physical' | 'digital' | 'split';
  onReturnToPortal?: () => void;
  lang?: 'es' | 'en';
  onToggleLang?: (lang: 'es' | 'en') => void;
}

export const AirlockPortal: React.FC<AirlockPortalProps> = ({
  onEnterWorld,
  lang: propLang = 'es',
  onToggleLang
}) => {
  const [doorState, setDoorState] = useState<'closed' | 'opening' | 'open'>('closed');
  const [targetWorld, setTargetWorld] = useState<'physical' | 'digital' | null>(null);
  
  // Language state (local or controlled)
  const [internalLang, setInternalLang] = useState<'es' | 'en'>(propLang);
  const lang = onToggleLang ? propLang : internalLang;

  const handleLangSwitch = (newLang: 'es' | 'en') => {
    setInternalLang(newLang);
    if (onToggleLang) onToggleLang(newLang);
    airlockAudio.playArcadeButtonPress();
  };

  // Holographic Login Modal State (appears in the center of the visor)
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCrm, setActiveCrm] = useState<'alfombras' | 'software'>('alfombras');
  const [isMuted, setIsMuted] = useState(false);

  // Button refs for proximity volume ducking
  const btnProductsRef = useRef<HTMLButtonElement | null>(null);
  const btnSoftwareRef = useRef<HTMLButtonElement | null>(null);
  const btnLoginRef = useRef<HTMLButtonElement | null>(null);

  // Translations
  const t = {
    es: {
      visor: 'APCR VISOR // v2.4',
      products: 'Productos',
      software: 'Software',
      login: 'Login',
      crmProducts: 'CRM PRODUCTOS',
      crmSoftware: 'CRM SOFTWARE',
      authTitle: 'APCR NEURAL TERMINAL // AUTENTICACIÓN',
      userLabel: 'USUARIO / IDENTIFICADOR',
      passLabel: 'CONTRASEÑA',
      loginBtn: 'ACCEDER AL CRM',
      decompress: 'DESCOMPRIMIENDO ESCLUSA APCR // INICIANDO PROTOCOLO...',
      rights: 'APCR® Registered Trademark. All Rights Reserved.',
      mute: 'Silenciar audio',
      unmute: 'Activar audio',
      connecting: 'Conectando con CRM...'
    },
    en: {
      visor: 'APCR VISOR // v2.4',
      products: 'Products',
      software: 'Software',
      login: 'Login',
      crmProducts: 'CRM PRODUCTS',
      crmSoftware: 'CRM SOFTWARE',
      authTitle: 'APCR NEURAL TERMINAL // AUTHENTICATION',
      userLabel: 'USER / IDENTIFIER',
      passLabel: 'PASSWORD',
      loginBtn: 'ACCESS CRM',
      decompress: 'DECOMPRESSING APCR AIRLOCK // INITIATING PROTOCOL...',
      rights: 'APCR® Registered Trademark. All Rights Reserved.',
      mute: 'Mute audio',
      unmute: 'Unmute audio',
      connecting: 'Connecting to CRM...'
    }
  }[lang];

  // Initialize background music & proximity ducking listener
  useEffect(() => {
    airlockAudio.initMusic('/music.mp3');

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      // Calculate minimum distance to any of the 3 top HUD buttons
      let minDistance = 9999;
      [btnProductsRef.current, btnSoftwareRef.current, btnLoginRef.current].forEach(btn => {
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        const distToCenter = Math.hypot(clientX - centerX, clientY - centerY);
        const distToEdge = Math.max(0, distToCenter - radius);
        if (distToEdge < minDistance) {
          minDistance = distToEdge;
        }
      });

      // Update proximity ducking (~50px is ~1cm to 1.2cm)
      airlockAudio.updateProximity(minDistance);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // Handler for Button 3: LOGIN (Projects central holographic HUD in the visor)
  const handleLoginClick = () => {
    // 1. Stop music immediately on touch
    airlockAudio.stopMusic();

    // 2. Tactile microswitch click
    airlockAudio.playArcadeButtonPress();

    // 3. CRT power on charge whine
    airlockAudio.playCrtPowerOn();

    // 4. Open holographic login in visor center
    setIsLoginOpen(true);
  };

  // Handler for Button 1 (Products) & Button 2 (Software): Opens Blast Doors
  const handleOpenDoor = (world: 'physical' | 'digital') => {
    if (doorState !== 'closed') return;

    try {
      airlockAudio.stopMusic();
    } catch {}

    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}

    try {
      airlockAudio.playAirlockOpen(world === 'digital');
    } catch {}

    setIsLoginOpen(false);
    setTargetWorld(world);
    setDoorState('opening');

    setTimeout(() => {
      setDoorState('open');
      onEnterWorld(world);
    }, 900);
  };

  const toggleSound = () => {
    const muted = airlockAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#e2e8f0] select-none font-sans">
      
      {/* 
        ========================================================================
        0. BACKGROUND CHAMBER (Revealed as the massive blast doors slide open)
        ========================================================================
      */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center transition-all duration-1000 ${
        targetWorld === 'digital' 
          ? 'bg-gradient-to-b from-[#0b1120] via-[#1e1b4b] to-[#0284c7]' 
          : 'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]'
      }`}>
        <div className="text-center p-6 text-white animate-pulse">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-5 shadow-2xl">
            {targetWorld === 'digital' ? (
              <Cpu className="w-12 h-12 text-cyan-400" />
            ) : (
              <Layers className="w-12 h-12 text-amber-400" />
            )}
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-slate-300">
            {t.decompress}
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        1. THE FIRST-PERSON BLAST DOORS (CLEAN, FULLSCREEN COVERAGE)
        ========================================================================
      */}

      {/* DESKTOP WIDESCREEN DOORS (md+) */}
      <div className="hidden md:block absolute inset-0 z-10 overflow-hidden">
        {/* LEFT DOOR HALF */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[8px_0_30px_rgba(0,0,0,0.3)] ${
            doorState === 'opening' || doorState === 'open' 
              ? '-translate-x-[102%]' 
              : 'translate-x-0'
          }`}
        >
          <img 
            src="/puerta_desktop_izq.jpg" 
            alt="Left Blast Door" 
            className="w-full h-full object-cover object-right select-none pointer-events-none"
          />
        </div>

        {/* RIGHT DOOR HALF */}
        <div 
          className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[-8px_0_30px_rgba(0,0,0,0.3)] ${
            doorState === 'opening' || doorState === 'open' 
              ? 'translate-x-[102%]' 
              : 'translate-x-0'
          }`}
        >
          <img 
            src="/puerta_desktop_der.jpg" 
            alt="Right Blast Door" 
            className="w-full h-full object-cover object-left select-none pointer-events-none"
          />
        </div>
      </div>

      {/* MOBILE VERTICAL DOORS (< md) - Both doors touchable directly */}
      <div className="block md:hidden absolute inset-0 z-10 overflow-hidden">
        {/* MOBILE LEFT DOOR HALF (Touch to open Alfombras) */}
        <div 
          onClick={() => handleOpenDoor('physical')}
          className={`absolute top-0 left-0 w-1/2 h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[6px_0_25px_rgba(0,0,0,0.3)] cursor-pointer ${
            doorState === 'opening' || doorState === 'open' 
              ? '-translate-x-[102%]' 
              : 'translate-x-0 active:brightness-95'
          }`}
        >
          <img 
            src="/puerta_movil_izq.jpg" 
            alt="Mobile Left Blast Door" 
            className="w-full h-full object-cover object-right select-none pointer-events-none"
          />
        </div>

        {/* MOBILE RIGHT DOOR HALF (Touch to open Software) */}
        <div 
          onClick={() => handleOpenDoor('digital')}
          className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-[-6px_0_25px_rgba(0,0,0,0.3)] cursor-pointer ${
            doorState === 'opening' || doorState === 'open' 
              ? 'translate-x-[102%]' 
              : 'translate-x-0 active:brightness-95'
          }`}
        >
          <img 
            src="/puerta_movil_der.jpg" 
            alt="Mobile Right Blast Door" 
            className="w-full h-full object-cover object-left select-none pointer-events-none"
          />
        </div>
      </div>

      {/* SEAM LASER LIGHT (Ignites upon door opening) */}
      {doorState === 'opening' && (
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full z-20 pointer-events-none animate-pulse ${
            targetWorld === 'digital'
              ? 'bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-500 shadow-[0_0_40px_#38bdf8]'
              : 'bg-gradient-to-b from-amber-200 via-white to-amber-300 shadow-[0_0_40px_#ffffff]'
          }`} 
        />
      )}

      {/* Hairline Center Seam when doors are closed */}
      {doorState === 'closed' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-full bg-slate-400/40 z-20 pointer-events-none" />
      )}

      {/* 
        ========================================================================
        2. VR VISOR / SMART GLASSES HUD OVERLAY
        ========================================================================
      */}
      {doorState === 'closed' && (
        <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-3 sm:p-6 md:p-8">
          
          {/* TOP BAR: Telemetry + Language Toggle + Audio Control */}
          <div className="w-full flex items-center justify-between">
            {/* Top Left: Visor Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
              <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-slate-700 uppercase">
                {t.visor}
              </span>
            </div>

            {/* Mobile-only compact pill */}
            <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[9px] font-mono font-semibold text-slate-700 uppercase">
                APCR
              </span>
            </div>

            {/* Top Right: Language Toggle + Audio Control */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Language Switcher ES / EN */}
              <div className="flex items-center rounded-full bg-white/50 hover:bg-white/70 backdrop-blur-md border border-white/70 p-0.5 shadow-sm transition-all">
                <button
                  type="button"
                  onClick={() => handleLangSwitch('es')}
                  aria-label="Cambiar idioma a Español"
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                    lang === 'es'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => handleLangSwitch('en')}
                  aria-label="Switch language to English"
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Audio Button */}
              <button
                onClick={toggleSound}
                aria-label={isMuted ? t.unmute : t.mute}
                className="p-2 sm:p-2.5 rounded-full bg-white/50 hover:bg-white/80 border border-white/70 text-slate-800 backdrop-blur-md shadow-sm transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>

          {/* 
            ====================================================================
            3. FLOATING TRANSLUCENT HUD MENU AT THE TOP (VISIONOS / AR GLASSES)
            Suspended gracefully at the top center of the visor
            ====================================================================
          */}
          <div className="absolute top-3 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 pointer-events-auto z-40 max-w-[95vw]">
            <nav 
              aria-label="Menú flotante visor APCR"
              className="relative px-2 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-white/45 hover:bg-white/60 backdrop-blur-2xl border border-white/75 shadow-[0_16px_40px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center gap-1.5 sm:gap-3 transition-all duration-300"
            >
              {/* Subtle ambient glass glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/10 via-white/20 to-purple-500/10 pointer-events-none" />

              {/* 
                BUTTON 1: PRODUCTOS / PRODUCTS
                Translucent base + Official Solid Black AP Monogram
              */}
              <button
                ref={btnProductsRef}
                onClick={() => handleOpenDoor('physical')}
                title={lang === 'es' ? 'Acceder a Productos Físicos' : 'Access Physical Products'}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-white/65 hover:bg-white/95 border border-white/85 shadow-[0_3px_10px_rgba(0,0,0,0.05)] active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-100/90 border border-slate-300/80 flex items-center justify-center p-0.5 sm:p-1 shadow-inner group-hover:scale-105 transition-transform">
                  <img 
                    src="/logo.png" 
                    alt="AP Productos" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] sm:text-sm font-semibold tracking-tight text-slate-900 group-hover:text-black">
                  {t.products}
                </span>
              </button>

              {/* Divider */}
              <div className="w-[1px] h-5 sm:h-6 bg-slate-300/60" />

              {/* 
                BUTTON 2: SOFTWARE
                Translucent base + Vibrant Cyan-Blue-Purple Gradient AP Monogram
              */}
              <button
                ref={btnSoftwareRef}
                onClick={() => handleOpenDoor('digital')}
                title={lang === 'es' ? 'Acceder a Ecosistema Digital' : 'Access Digital Ecosystem'}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-white/65 hover:bg-white/95 border border-white/85 shadow-[0_3px_10px_rgba(37,99,235,0.12)] active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-50 to-purple-50 border border-blue-200/80 flex items-center justify-center p-0.5 sm:p-1 shadow-inner group-hover:shadow-[0_0_12px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-all">
                  <img 
                    src="/logo_color.png" 
                    alt="AP Software" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] sm:text-sm font-bold tracking-tight bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600">
                  {t.software}
                </span>
              </button>

              {/* Divider */}
              <div className="w-[1px] h-5 sm:h-6 bg-slate-300/60" />

              {/* 
                BUTTON 3: LOGIN
                Translucent base + Lock Icon + Text LOGIN
              */}
              <button
                ref={btnLoginRef}
                onClick={handleLoginClick}
                title={lang === 'es' ? 'Desplegar Terminal de Login' : 'Deploy Login Terminal'}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-white/65 hover:bg-white/95 border border-white/85 shadow-[0_3px_10px_rgba(6,182,212,0.12)] active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-cyan-50 border border-cyan-200/80 flex items-center justify-center p-0.5 sm:p-1 shadow-inner group-hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-all">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-700" />
                </div>
                <span className="text-[11px] sm:text-sm font-mono font-bold tracking-wider text-slate-800 group-hover:text-cyan-900 uppercase">
                  {t.login}
                </span>
              </button>

            </nav>
          </div>

          {/* MOBILE DIRECT ACTION BUTTONS (Always reachable right at thumb level) */}
          <div className="md:hidden w-full max-w-sm mx-auto pointer-events-auto flex flex-col gap-2.5 pb-2 px-2">
            <button
              type="button"
              onClick={() => handleOpenDoor('digital')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-[0_12px_28px_rgba(37,99,235,0.45)] flex items-center justify-between border border-white/40 active:scale-95 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black leading-tight text-white tracking-wide">ENTRAR A SOFTWARE & APPS</div>
                  <div className="text-[10px] text-cyan-200 font-medium">9 Demos Interactivos en Vivo</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenDoor('physical')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900/85 hover:bg-slate-900 text-white font-bold text-xs shadow-lg backdrop-blur-md flex items-center justify-between border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight text-white">CATÁLOGO DE ALFOMBRAS</div>
                  <div className="text-[9px] text-slate-300">Alfombras personalizadas de alto tránsito</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
            </button>
          </div>

          {/* Bottom subtle visor watermark / trademark */}
          <div className="w-full text-center pointer-events-none pb-1">
            <p className="text-[9px] sm:text-xs font-mono tracking-widest text-slate-500/80">
              {t.rights}
            </p>
          </div>

        </div>
      )}

      {/* 
        ========================================================================
        4. HOLOGRAPHIC LOGIN SCREEN IN THE VISOR CENTER
        Projects right in front of the user when LOGIN is pressed
        ========================================================================
      */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* Central Holographic Spatial Window */}
          <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#090e17]/95 border border-cyan-500/40 text-slate-100 shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_40px_rgba(6,182,212,0.25)] overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            
            {/* Holographic Scanline Sheen */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-40 z-10" />
            
            {/* Background Hologram Ambient Gradient */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-900/60 relative z-20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  {t.authTitle}
                </span>
              </div>

              <button
                onClick={() => setIsLoginOpen(false)}
                title={lang === 'es' ? 'Cerrar Holograma' : 'Close Hologram'}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CRM Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-5 mb-5 relative z-20">
              <button
                type="button"
                onClick={() => setActiveCrm('alfombras')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                  activeCrm === 'alfombras'
                    ? 'bg-white text-slate-900 border-white shadow-md'
                    : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.crmProducts}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCrm('software')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center justify-center gap-2 ${
                  activeCrm === 'software'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{t.crmSoftware}</span>
              </button>
            </div>

            {/* Form Inputs */}
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                alert(`${t.connecting} (${activeCrm.toUpperCase()})`); 
              }} 
              className="space-y-3 relative z-20"
            >
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">
                  {t.userLabel}
                </label>
                <input 
                  type="text" 
                  placeholder="admin@apcr.cr" 
                  required 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-sm font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase">
                  {t.passLabel}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  required 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 text-sm font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-98 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.loginBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Legal Notice */}
            <div className="mt-5 pt-3 border-t border-slate-800 text-center relative z-20">
              <p className="text-[10px] font-mono text-slate-500 tracking-wider">
                {t.rights}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
