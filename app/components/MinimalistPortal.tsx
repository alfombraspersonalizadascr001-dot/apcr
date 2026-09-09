"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { airlockAudio } from '../utils/airlockSound';
import { 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  X, 
  Lock, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  ExternalLink,
  Building2,
  Sparkles,
  Radio,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MinimalistPortalProps {
  onEnterWorld: (world: 'physical' | 'digital') => void;
  currentWorld?: 'portal' | 'physical' | 'digital' | 'split';
  onReturnToPortal?: () => void;
  lang?: 'es' | 'en';
  onToggleLang?: (lang: 'es' | 'en') => void;
}

export const MinimalistPortal: React.FC<MinimalistPortalProps> = ({
  onEnterWorld,
  lang: propLang = 'es',
  onToggleLang
}) => {
  const [internalLang, setInternalLang] = useState<'es' | 'en'>(propLang);
  const lang = onToggleLang ? propLang : internalLang;

  const handleLangSwitch = (newLang: 'es' | 'en') => {
    setInternalLang(newLang);
    if (onToggleLang) onToggleLang(newLang);
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
  };

  // Holographic Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // CRM Authentication State (Pre-filled for admin convenience)
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin008');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Hover states for dynamic atmospheric glows
  const [hoveredPortal, setHoveredPortal] = useState<'physical' | 'digital' | null>(null);

  // Sound init
  useEffect(() => {
    try {
      airlockAudio.initMusic('/music.mp3');
      setIsMuted(airlockAudio.isSoundMuted());
    } catch {}
  }, []);

  const handleSoundToggle = () => {
    try {
      const muted = airlockAudio.toggleMute();
      setIsMuted(muted);
    } catch {}
  };

  const handleOpenLogin = () => {
    try {
      airlockAudio.playArcadeButtonPress();
      airlockAudio.playCrtPowerOn();
    } catch {}
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    setIsLoginOpen(false);
    setLoginError('');
  };

  // Real Supabase CRM Authentication Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess(false);

    try {
      try {
        airlockAudio.playArcadeButtonPress();
      } catch {}

      const cleanId = loginIdentifier.trim();
      const cleanPass = loginPassword.trim();

      if (!cleanId || !cleanPass) {
        setLoginError(lang === 'es' ? 'Por favor completa todos los campos.' : 'Please fill all fields.');
        setLoginLoading(false);
        return;
      }

      let query = supabase.from('crm_users').select('*');

      if (cleanId === 'admin' || cleanId.toLowerCase() === 'admin@apcr.cr' || cleanId.toLowerCase() === 'admin@apcr.online') {
        query = query.or('account_number.eq.admin,email.eq.admin@apcr.cr,email.eq.admin@apcr.online');
      } else {
        query = query.or(`email.eq."${cleanId}",account_number.eq."${cleanId}"`);
      }

      const { data: users, error: authError } = await query;

      if (authError || !users || users.length === 0) {
        setLoginError(lang === 'es' ? 'Credenciales inválidas. Verifica tu usuario y contraseña.' : 'Invalid credentials. Please verify your username and password.');
        setLoginLoading(false);
        return;
      }

      const user = users.find(u => u.password === cleanPass);
      if (!user) {
        setLoginError(lang === 'es' ? 'Credenciales inválidas. Verifica tu usuario y contraseña.' : 'Invalid credentials. Please verify your username and password.');
        setLoginLoading(false);
        return;
      }

      setLoginSuccess(true);
      try {
        airlockAudio.playAirlockOpen(false);
      } catch {}

      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `crm_authenticated=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_user_id=${user.id}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_role=${user.role}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_agent_name=${encodeURIComponent(user.contact_name || 'Admin')}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

      localStorage.setItem('crm_authenticated', 'true');
      localStorage.setItem('crm_user_role', user.role);
      localStorage.setItem('crm_user_name', user.contact_name || 'Admin');
      localStorage.setItem('apcr_user', JSON.stringify({
        id: user.id,
        firstName: user.contact_name?.split(' ')[0] || user.company_name,
        lastName: user.contact_name?.split(' ').slice(1).join(' ') || '',
        company: user.company_name,
        email: user.email,
        mobilePhone: user.phone,
        role: user.role
      }));

      setTimeout(() => {
        if (user.role === 'admin') {
          window.location.href = '/crm';
        } else {
          window.location.href = '/dashboard';
        }
      }, 700);

    } catch (err) {
      console.error('Login error:', err);
      setLoginError(lang === 'es' ? 'Error al autenticar con el servidor.' : 'Server authentication error.');
      setLoginLoading(false);
    }
  };

  const handlePortalChoice = (world: 'physical' | 'digital') => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    onEnterWorld(world);
  };

  const t = {
    es: {
      tag: "PORTALES MAESTROS // ARQUITECTURA & SOFTWARE",
      title1: "Espacios Arquitectónicos de Precisión.",
      title2: "Ecosistemas Digitales Inteligentes.",
      subtitle: "Una experiencia unificada entre sistemas de pisos y barreras arquitectónicas de alto desempeño y matrices de software empresarial en la nube.",
      div1Badge: "DIVISIÓN 01 // FÍSICO",
      div1Title: "PRODUCTOS",
      div1Category: "Pisos & Barreras Arquitectónicas",
      div1Headline: "Sistemas de Perfiles & Tránsito Pesado",
      div1Desc: "Soluciones de entrada para alto flujo peatonal, alfombras modulares vulcanizadas, perfiles de aluminio para cuartos limpios y aplicaciones comerciales de máxima durabilidad.",
      div1Cta: "EXPLORAR PRODUCTOS",
      div1Metric: "14,000+ INSTALACIONES",
      div1Sub: "DESDE 1994 // ALFOMBRAS & PISOS",
      
      div2Badge: "DIVISIÓN 02 // DIGITAL",
      div2Title: "SOFTWARE",
      div2Category: "Infraestructura Digital & Cloud",
      div2Headline: "Hospitality OS & Telemetría Empresarial",
      div2Desc: "Sistema operativo para restaurantes y retail, comandas táctiles ultra-rápidas, facturación electrónica 4.4, control de inventarios, CRM unificado y analítica en tiempo real.",
      div2Cta: "ENTRAR A SOFTWARE & APPS",
      div2Metric: "2.4M TRANSACCIONES / MES",
      div2Sub: "APCR OS // CLOUD MATRIX",

      nodeStatus: "NODO ACTIVO // 99.98%",
      clientPortal: "ACCESO CRM",
      soundOn: "AUDIO ON",
      soundOff: "AUDIO MUTE",
      axis: "EJE DUAL 00",
      
      m1Label: "ESTABILIDAD OPERATIVA",
      m1Value: "99.982%",
      m1Sub: "Sincronización en tiempo real",

      m2Label: "EXPERIENCIA Y TRAYECTORIA",
      m2Value: "30+ AÑOS",
      m2Sub: "Líderes en Costa Rica y CA",

      m3Label: "VOLUMEN DIGITAL",
      m3Value: "2.4M+ TX",
      m3Sub: "Procesadas mensualmente",

      m4Label: "COBERTURA TOTAL",
      m4Value: "7 PROVINCIAS",
      m4Sub: "Soporte físico y telemático",

      switchPortalTip: "Cambiar o gestionar portadas desde el CRM",
      authModalTitle: "APCR NEURAL TERMINAL // AUTENTICACIÓN CRM",
      userLabel: "USUARIO O CORREO",
      passLabel: "CONTRASEÑA",
      loginBtn: "ACCEDER AL CRM",
      verifying: "VERIFICANDO CREDENCIALES..."
    },
    en: {
      tag: "MASTER PORTALS // ARCHITECTURE & SOFTWARE",
      title1: "Precision Engineered Architectural Spaces.",
      title2: "Intelligent Digital Ecosystems.",
      subtitle: "A unified continuum connecting high-durability physical flooring barrier systems with mission-critical cloud software platforms.",
      div1Badge: "DIVISION 01 // PHYSICAL",
      div1Title: "PRODUCTS",
      div1Category: "Architectural Flooring & Barriers",
      div1Headline: "High-Traffic Inset Profile Systems",
      div1Desc: "Heavy-duty entrance solutions, vulcanized rubber striations, aluminum sub-frames for cleanrooms and commercial Grade-A architectures.",
      div1Cta: "EXPLORE PRODUCTS",
      div1Metric: "14,000+ INSTALLATIONS",
      div1Sub: "EST. 1994 // MATS & FLOORING",
      
      div2Badge: "DIVISION 02 // DIGITAL",
      div2Title: "SOFTWARE",
      div2Category: "Digital Infrastructure & Cloud",
      div2Headline: "Hospitality OS & Telemetry Matrix",
      div2Desc: "Point of Sale & Hospitality OS, ultra-fast table management, electronic invoicing, cloud inventory sync, enterprise CRM, and live analytics.",
      div2Cta: "LAUNCH SOFTWARE & APPS",
      div2Metric: "2.4M TRANSACTIONS / MO",
      div2Sub: "APCR OS // CLOUD MATRIX",

      nodeStatus: "NODE ACTIVE // 99.98%",
      clientPortal: "CRM PORTAL",
      soundOn: "AUDIO ON",
      soundOff: "AUDIO MUTE",
      axis: "DUAL AXIS 00",

      m1Label: "SYSTEM STABILITY",
      m1Value: "99.982%",
      m1Sub: "Zero latency synchronization",

      m2Label: "ENGINEERING HERITAGE",
      m2Value: "30+ YEARS",
      m2Sub: "Central America footprint",

      m3Label: "DIGITAL VELOCITY",
      m3Value: "2.4M+ TX",
      m3Sub: "Processed monthly",

      m4Label: "CONTINUOUS SUPPORT",
      m4Value: "24/7 LIVE",
      m4Sub: "Field & cloud operations",

      switchPortalTip: "Manage and switch landing pages in CRM",
      authModalTitle: "APCR NEURAL TERMINAL // CRM AUTHENTICATION",
      userLabel: "USER OR EMAIL",
      passLabel: "PASSWORD",
      loginBtn: "ACCESS CRM",
      verifying: "VERIFYING CREDENTIALS..."
    }
  }[lang];

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#e5e1e5] font-sans overflow-x-hidden selection:bg-white/20 selection:text-white flex flex-col justify-between">
      {/* Dynamic Ambient Background Illumination */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.04) 0%, transparent 60%),
            radial-gradient(circle at 20% 50%, ${hoveredPortal === 'physical' ? 'rgba(255, 180, 50, 0.08)' : 'rgba(255, 255, 255, 0.015)'} 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, ${hoveredPortal === 'digital' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.015)'} 0%, transparent 50%),
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* TOP HUD BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070709]/80 border-b border-white/10 px-4 sm:px-8 lg:px-16 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark & Monolithic Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm tracking-widest text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              AP
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm tracking-[0.25em] uppercase">APCR</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-zinc-400 font-mono tracking-wider">
                ARCHITECTURAL & DIGITAL SYSTEMS
              </span>
            </div>
          </div>

          {/* Right Controls HUD */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
            {/* Live Node Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-zinc-300 text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t.nodeStatus}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all"
              title={isMuted ? "Activar audio" : "Silenciar audio"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <div className="flex items-end gap-0.5 h-3.5 w-3.5 pb-0.5">
                  <span className="w-0.5 bg-emerald-400 h-2 animate-pulse"></span>
                  <span className="w-0.5 bg-emerald-400 h-3 animate-pulse delay-75"></span>
                  <span className="w-0.5 bg-emerald-400 h-1.5 animate-pulse delay-150"></span>
                </div>
              )}
              <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
                {isMuted ? t.soundOff : t.soundOn}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-900/80 rounded-lg p-0.5 border border-white/10 text-[11px]">
              <button
                onClick={() => handleLangSwitch('es')}
                className={`px-2 py-1 rounded transition-colors font-bold ${
                  lang === 'es' 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => handleLangSwitch('en')}
                className={`px-2 py-1 rounded transition-colors font-bold ${
                  lang === 'en' 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Client / CRM Access Button */}
            <button
              onClick={handleOpenLogin}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-sans font-semibold text-xs tracking-wider transition-all duration-200 shadow-lg shadow-white/5 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-zinc-800 group-hover:rotate-12 transition-transform" />
              <span>{t.clientPortal}</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO & DUAL CIRCULAR PORTALS */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 sm:pt-14 pb-16 flex-1 flex flex-col justify-center">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-md mb-5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
              {t.tag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.15] mb-4">
            {t.title1}
            <span className="block font-normal text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 mt-1">
              {t.title2}
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* DUAL MONUMENTAL CIRCULAR PORTALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative items-stretch">
          {/* Central Architectural Axis Marker (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center gap-3 pointer-events-none opacity-50">
            <span className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent"></span>
            <div className="font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-full border border-white/20 bg-zinc-950/90 text-zinc-300 backdrop-blur-md">
              {t.axis}
            </div>
            <span className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent"></span>
          </div>

          {/* ========================================================
              PORTAL 01: PRODUCTOS (Circular Color Emblem)
             ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredPortal('physical')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="group relative rounded-2xl p-7 sm:p-10 bg-zinc-950/70 border border-white/10 hover:border-amber-500/40 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-amber-500/10"
          >
            {/* Ambient Radial Hover Glow */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] transition-all duration-700 opacity-20 group-hover:opacity-60"></div>

            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 font-mono text-xs">
              <span className="text-white flex items-center gap-2 font-semibold">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                {t.div1Badge}
              </span>
              <span className="text-zinc-400 tracking-wider text-[11px]">
                {t.div1Metric}
              </span>
            </div>

            {/* Monumental Concentric Emblem Badge */}
            <div className="my-8 sm:my-10 flex flex-col items-center justify-center relative">
              {/* Outer Decorative Orbit */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-white/15 flex items-center justify-center p-4 transition-all duration-700 group-hover:scale-105 group-hover:border-amber-400/40 bg-zinc-900/30">
                {/* Concentric Dashed Ring */}
                <div className="absolute inset-2.5 rounded-full border border-white/10 border-dashed animate-[spin_60s_linear_infinite]"></div>

                {/* Tactile Architectural Crosshairs */}
                <div className="absolute inset-6 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-white/10 absolute"></div>
                  <div className="h-full w-[1px] bg-white/10 absolute"></div>
                  <div className="w-full h-[1px] bg-white/10 absolute rotate-45"></div>
                  <div className="w-full h-[1px] bg-white/10 absolute -rotate-45"></div>
                </div>

                {/* USER'S CIRCULAR EMBLEM CORE */}
                <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-zinc-900 border-2 border-white/30 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:border-amber-400 group-hover:shadow-[0_0_35px_rgba(251,191,36,0.3)] transition-all duration-500 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logos/ap-circle-color.jpg"
                    alt="APCR Productos Logo"
                    width={180}
                    height={180}
                    className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>

              {/* Emblem Label Below */}
              <div className="mt-4 text-center">
                <span className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase block">
                  {t.div1Sub}
                </span>
              </div>
            </div>

            {/* Division Description & Call To Action */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] text-amber-400/90 tracking-widest uppercase block mb-1">
                  {t.div1Category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {t.div1Headline}
                </h3>
              </div>

              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {t.div1Desc}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handlePortalChoice('physical')}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-white text-white hover:text-zinc-950 border border-white/15 hover:border-white font-sans font-bold text-xs tracking-[0.16em] transition-all duration-300 group/btn shadow-lg active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400 group-hover/btn:text-zinc-950 transition-colors" />
                    {t.div1Cta}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              PORTAL 02: SOFTWARE (Circular Black Monogram)
             ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredPortal('digital')}
            onMouseLeave={() => setHoveredPortal(null)}
            className="group relative rounded-2xl p-7 sm:p-10 bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-cyan-500/10"
          >
            {/* Ambient Radial Hover Glow */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] transition-all duration-700 opacity-20 group-hover:opacity-60"></div>

            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 font-mono text-xs">
              <span className="text-white flex items-center gap-2 font-semibold">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                {t.div2Badge}
              </span>
              <span className="text-zinc-400 tracking-wider text-[11px]">
                {t.div2Metric}
              </span>
            </div>

            {/* Monumental Concentric Emblem Badge */}
            <div className="my-8 sm:my-10 flex flex-col items-center justify-center relative">
              {/* Outer Decorative Orbit */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-white/15 flex items-center justify-center p-4 transition-all duration-700 group-hover:scale-105 group-hover:border-cyan-400/40 bg-zinc-900/30">
                {/* Concentric Dotted Ring */}
                <div className="absolute inset-2.5 rounded-full border border-white/10 border-dotted animate-[spin_45s_linear_infinite_reverse]"></div>

                {/* Digital Matrix Node Orbits */}
                <div className="absolute inset-6 rounded-full border border-white/20 flex items-center justify-center">
                  <span className="absolute top-0 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"></span>
                  <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"></span>
                  <span className="absolute left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"></span>
                  <span className="absolute right-0 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"></span>
                  <div className="w-4/5 h-[1px] bg-cyan-500/20 absolute rotate-12"></div>
                  <div className="w-4/5 h-[1px] bg-cyan-500/20 absolute -rotate-12"></div>
                </div>

                {/* USER'S CIRCULAR EMBLEM CORE */}
                <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-white border-2 border-white/50 p-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] group-hover:border-cyan-400 group-hover:shadow-[0_0_35px_rgba(34,211,238,0.3)] transition-all duration-500 overflow-hidden flex items-center justify-center">
                  <Image
                    src="/images/logos/ap-monogram-black.png"
                    alt="APCR Software Monogram Logo"
                    width={180}
                    height={180}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>

              {/* Emblem Label Below */}
              <div className="mt-4 text-center">
                <span className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase block">
                  {t.div2Sub}
                </span>
              </div>
            </div>

            {/* Division Description & Call To Action */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[11px] text-cyan-400/90 tracking-widest uppercase block mb-1">
                  {t.div2Category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  {t.div2Headline}
                </h3>
              </div>

              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {t.div2Desc}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => handlePortalChoice('digital')}
                  className="w-full flex items-center justify-between px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-white text-white hover:text-zinc-950 border border-white/15 hover:border-white font-sans font-bold text-xs tracking-[0.16em] transition-all duration-300 group/btn shadow-lg active:scale-[0.99]"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400 group-hover/btn:text-zinc-950 transition-colors" />
                    {t.div2Cta}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TELEMETRY READOUT METRICS */}
        <section className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider block uppercase">
              {t.m1Label}
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight block">
              {t.m1Value}
            </span>
            <span className="text-xs text-zinc-500 font-light block">
              {t.m1Sub}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider block uppercase">
              {t.m2Label}
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight block">
              {t.m2Value}
            </span>
            <span className="text-xs text-zinc-500 font-light block">
              {t.m2Sub}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider block uppercase">
              {t.m3Label}
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight block">
              {t.m3Value}
            </span>
            <span className="text-xs text-zinc-500 font-light block">
              {t.m3Sub}
            </span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider block uppercase">
              {t.m4Label}
            </span>
            <span className="text-xl sm:text-2xl font-light text-white tracking-tight block">
              {t.m4Value}
            </span>
            <span className="text-xs text-zinc-500 font-light block">
              {t.m4Sub}
            </span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-6 px-4 sm:px-8 lg:px-16 text-center sm:flex sm:justify-between sm:items-center text-xs text-zinc-500 font-mono">
        <div>
          © {new Date().getFullYear()} APCR® — Alfombras & Software. All rights reserved.
        </div>
        <div className="mt-2 sm:mt-0 flex items-center justify-center gap-4">
          <a href="/crm" className="hover:text-zinc-300 transition-colors">
            CRM Central
          </a>
          <span>•</span>
          <a href="/crm/landing-pages" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Galería de Portadas
          </a>
        </div>
      </footer>

      {/* ========================================================
          HOLOGRAPHIC LOGIN MODAL (NEURAL CRM ACCESS)
         ======================================================== */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md rounded-2xl bg-[#0e0e12] border border-white/20 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Ambient Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full bg-blue-600/20 blur-[80px]"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-white tracking-wider">
                  {t.authModalTitle}
                </span>
              </div>
              <button
                onClick={handleCloseLogin}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                  {t.userLabel}
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/15 focus:border-white text-white font-sans text-sm focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 uppercase mb-1.5">
                  {t.passLabel}
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-white/15 focus:border-white text-white font-sans text-sm focus:outline-none transition-colors"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Acceso concedido. Cargando CRM...
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-sans font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-white/10 active:scale-95 disabled:opacity-50"
                >
                  {loginLoading ? t.verifying : t.loginBtn}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="font-mono text-[10px] text-zinc-500">
                  Credenciales de administrador pre-cargadas para acceso rápido
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
