"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { airlockAudio } from '../utils/airlockSound';
import { childrenMusic, CHILDREN_SONGS, SongInfo } from '../utils/childrenMusic';
import { 
  Volume2, 
  VolumeX, 
  Lock, 
  X, 
  CheckCircle2, 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  Sparkles,
  Heart
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
  onEnterWorld
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Estado de Música del Día del Niño
  const [isChildMusicPlaying, setIsChildMusicPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo>(CHILDREN_SONGS[0]);
  const [showChildMusicPlayer, setShowChildMusicPlayer] = useState(true);

  // CRM Auth State
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin008');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Hover state
  const [hovered, setHovered] = useState<'physical' | 'digital' | null>(null);

  useEffect(() => {
    // Escuchar estado del reproductor infantil
    const unsubscribe = childrenMusic.addListener((playing, song) => {
      setIsChildMusicPlaying(playing);
      setCurrentSong(song);
    });

    return () => {
      unsubscribe();
      childrenMusic.pause();
    };
  }, []);

  const handleToggleChildMusic = () => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    childrenMusic.toggle();
  };

  const handleNextSong = () => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    childrenMusic.next();
  };

  const handleOpenLogin = () => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    setIsLoginOpen(true);
  };

  const handlePortalChoice = (world: 'physical' | 'digital') => {
    try {
      airlockAudio.playArcadeButtonPress();
      childrenMusic.pause();
    } catch {}
    onEnterWorld(world);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess(false);

    try {
      const cleanId = loginIdentifier.trim();
      const cleanPass = loginPassword.trim();

      let query = supabase.from('crm_users').select('*');
      if (cleanId === 'admin' || cleanId.toLowerCase() === 'admin@apcr.cr' || cleanId.toLowerCase() === 'admin@apcr.online') {
        query = query.or('account_number.eq.admin,email.eq.admin@apcr.cr,email.eq.admin@apcr.online');
      } else {
        query = query.or(`email.eq."${cleanId}",account_number.eq."${cleanId}"`);
      }

      const { data: users, error: authError } = await query;
      if (authError || !users || users.length === 0) {
        setLoginError('Credenciales inválidas');
        setLoginLoading(false);
        return;
      }

      const user = users.find(u => u.password === cleanPass);
      if (!user) {
        setLoginError('Credenciales inválidas');
        setLoginLoading(false);
        return;
      }

      setLoginSuccess(true);
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `crm_authenticated=true; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_user_id=${user.id}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_role=${user.role}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      document.cookie = `crm_agent_name=${encodeURIComponent(user.contact_name || 'Admin')}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

      localStorage.setItem('crm_authenticated', 'true');
      localStorage.setItem('crm_user_role', user.role);
      localStorage.setItem('crm_user_name', user.contact_name || 'Admin');

      setTimeout(() => {
        window.location.href = user.role === 'admin' ? '/crm' : '/dashboard';
      }, 600);
    } catch {
      setLoginError('Error de autenticación');
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between select-none relative bg-[#F8F9FA] text-[#111114] font-sans overflow-x-hidden">
      {/* Ambient Daylight Depth Glow inspired by Stitch Executive Design */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: hovered === 'physical'
            ? 'radial-gradient(circle 700px at 30% 50%, rgba(0, 0, 0, 0.04) 0%, rgba(248, 249, 250, 0) 100%)'
            : hovered === 'digital'
            ? 'radial-gradient(circle 700px at 70% 50%, rgba(0, 43, 127, 0.04) 0%, rgba(248, 249, 250, 0) 100%)'
            : 'radial-gradient(circle 600px at 50% 50%, rgba(212, 175, 55, 0.035) 0%, rgba(248, 249, 250, 0) 100%)'
        }}
      />

      {/* HEADER: Minimal Executive HUD con fondo claro de alto contraste */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-14 pt-6 pb-4 flex items-center justify-between z-20">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <span className="text-[14px] sm:text-[15px] tracking-[0.38em] font-bold text-[#111114] uppercase">
            APCR
          </span>
          <span className="hidden xs:inline-block text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 border border-blue-600/20">
            COSTA RICA
          </span>
        </div>

        {/* Header Actions: Día del Niño Music & CRM Access */}
        <div className="flex items-center gap-3 sm:gap-5 text-[11px] tracking-[0.2em] uppercase font-medium">
          {/* Botón interactivo de Música Infantil */}
          <button 
            onClick={handleToggleChildMusic}
            title={isChildMusicPlaying ? 'Pausar música infantil' : 'Escuchar música infantil tradicional'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
              isChildMusicPlaying 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 shadow-sm shadow-amber-500/20' 
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isChildMusicPlaying ? 'bg-amber-500 animate-ping' : 'bg-neutral-400'}`}></span>
            <Music className={`w-3.5 h-3.5 ${isChildMusicPlaying ? 'text-amber-600 animate-bounce' : 'text-neutral-500'}`} />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider">
              {isChildMusicPlaying ? 'SONANDO ♫' : 'MÚSICA'}
            </span>
          </button>

          {/* CRM Access */}
          <button 
            onClick={handleOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-400 shadow-sm transition-all duration-300"
          >
            <Lock className="w-3 h-3 text-neutral-500" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider">CRM</span>
          </button>
        </div>
      </header>

      {/* BANNER CELEBRATORIO: DÍA DEL NIÑO EN COSTA RICA (9 DE SEPTIEMBRE) */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-2 z-20">
        <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-white to-blue-50 border border-amber-300/50 p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-base">🎈</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-amber-950 flex items-center gap-1">
                ¡Feliz Día del Niño en Costa Rica! 🇨🇷
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-900 px-2 py-0.5 rounded-full">
                9 de Septiembre
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-tight">
              Celebramos la alegría de la niñez costarricense. 25% de descuento especial en alfombras ergonómicas infantiles para kínder y escuelas.
            </p>
          </div>

          {/* Mini Reproductor de la Canción Infantil */}
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-white/90 border border-amber-200/80 rounded-xl px-2.5 py-1.5 shadow-sm">
            <button
              onClick={handleToggleChildMusic}
              className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-transform active:scale-95"
              title={isChildMusicPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isChildMusicPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            <div className="text-left px-1">
              <span className="text-[10px] font-bold text-neutral-900 block truncate max-w-[130px]">
                {currentSong.title.split('(')[0]}
              </span>
              <span className="text-[9px] font-mono text-neutral-500 block">
                {isChildMusicPlaying ? '♫ Sonando...' : 'Pausado'}
              </span>
            </div>

            <button
              onClick={handleNextSong}
              className="p-1 rounded text-neutral-400 hover:text-neutral-800 transition-colors"
              title="Siguiente canción infantil"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN STAGE: EXACTLY TWO MONUMENTAL LUXURY CIRCULAR EMBLEMS SOBRE FONDO CLARO */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 my-auto z-10 py-6 sm:py-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 sm:gap-14 md:gap-20 lg:gap-28">
          
          {/* ========================================================
              PORTAL 01: PRODUCTOS (ALFOMBRAS CON LOGO EN NEGRO)
             ======================================================== */}
          <button
            type="button"
            onMouseEnter={() => setHovered('physical')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handlePortalChoice('physical')}
            className="group flex flex-col items-center no-underline focus:outline-none transition-transform duration-500 hover:scale-[1.03] active:scale-95"
          >
            {/* Monumental Circular Medallion con altísimo contraste */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[330px] lg:h-[330px] rounded-full flex items-center justify-center transition-all duration-500">
              {/* Outer Daylight Halo */}
              <div className="absolute -inset-4 rounded-full bg-neutral-950/[0.04] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Outer Architectural Bevel Ring en Blanco & Sombra Profunda */}
              <div className="absolute inset-0 rounded-full bg-white border-2 border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] transition-all duration-500 group-hover:border-neutral-950 group-hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.25)]"></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className="absolute inset-3 rounded-full border border-neutral-200"></div>

              {/* Internal Medallion Housing the Black Logo */}
              <div className="relative w-[84%] h-[84%] rounded-full bg-[#111114] border-2 border-neutral-800 flex items-center justify-center overflow-hidden shadow-2xl p-6 group-hover:border-neutral-700 transition-colors duration-500">
                <Image
                  src="/images/logos/ap-monogram-black.png"
                  alt="Productos - Alfombras"
                  width={280}
                  height={280}
                  className="w-full h-full object-contain filter invert opacity-95 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Portal Label: 'PRODUCTOS' con tipografía oscura ultra legible */}
            <div className="mt-6 text-center space-y-1">
              <span className="text-base sm:text-lg tracking-[0.3em] uppercase font-bold text-[#111114] group-hover:text-blue-700 transition-colors duration-300 block">
                PRODUCTOS
              </span>
              <span className="text-[11px] tracking-wider uppercase font-mono text-neutral-500 block">
                Alfombras de vinil troqueladas
              </span>
            </div>
          </button>

          {/* ========================================================
              PORTAL 02: SOFTWARE (SUITE CON LOGO EN COLORES)
             ======================================================== */}
          <button
            type="button"
            onMouseEnter={() => setHovered('digital')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handlePortalChoice('digital')}
            className="group flex flex-col items-center no-underline focus:outline-none transition-transform duration-500 hover:scale-[1.03] active:scale-95"
          >
            {/* Monumental Circular Medallion */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[330px] lg:h-[330px] rounded-full flex items-center justify-center transition-all duration-500">
              {/* Outer Daylight Halo */}
              <div className="absolute -inset-4 rounded-full bg-blue-600/[0.06] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Matching Outer Bevel Frame */}
              <div className="absolute inset-0 rounded-full bg-white border-2 border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] transition-all duration-500 group-hover:border-blue-600 group-hover:shadow-[0_30px_70px_-10px_rgba(0,43,127,0.22)]"></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className="absolute inset-3 rounded-full border border-neutral-200"></div>

              {/* Internal Medallion Housing the 4-Color Logo */}
              <div className="relative w-[84%] h-[84%] rounded-full overflow-hidden shadow-2xl flex items-center justify-center border-2 border-neutral-200 group-hover:border-blue-500 transition-colors duration-500 bg-white">
                <Image
                  src="/images/logos/ap-circle-color.jpg"
                  alt="Software"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Portal Label: 'SOFTWARE' con tipografía oscura ultra legible */}
            <div className="mt-6 text-center space-y-1">
              <span className="text-base sm:text-lg tracking-[0.3em] uppercase font-bold text-[#111114] group-hover:text-blue-700 transition-colors duration-300 block">
                SOFTWARE
              </span>
              <span className="text-[11px] tracking-wider uppercase font-mono text-neutral-500 block">
                Suite digital & punto de venta
              </span>
            </div>
          </button>

        </div>
      </main>

      {/* FOOTER: Pure Executive Minimal Elegance sobre fondo claro */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 text-[11px] tracking-[0.18em] text-neutral-500 uppercase font-medium">
        <span>© 2026 APCR COSTA RICA. TODOS LOS DERECHOS RESERVADOS.</span>
        <div className="flex items-center gap-4">
          <a href="/simulador" className="hover:text-neutral-900 transition-colors">
            SIMULADOR
          </a>
          <span>•</span>
          <a href="/crm/landing-pages" className="hover:text-neutral-900 transition-colors">
            PORTADAS
          </a>
        </div>
      </footer>

      {/* MINIMAL EXECUTIVE LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xs rounded-2xl bg-white border border-neutral-200 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <span className="text-xs tracking-[0.25em] font-bold text-neutral-900 uppercase">ACCESO CRM</span>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Usuario</label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 focus:border-black text-neutral-900 text-xs focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-300 focus:border-black text-neutral-900 text-xs focus:outline-none transition-colors"
                />
              </div>

              {loginError && (
                <div className="text-red-600 text-[11px] font-medium">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="text-emerald-600 text-[11px] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Acceso concedido
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 rounded-lg bg-[#111114] text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-2"
              >
                {loginLoading ? 'Ingresando...' : 'Entrar al CRM'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
