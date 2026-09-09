'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { airlockAudio } from '../utils/airlockSound';
import { childrenMusic, CHILDREN_SONGS, SongInfo } from '../utils/childrenMusic';
import { 
  Lock, 
  X, 
  CheckCircle2, 
  Play, 
  Pause, 
  SkipForward, 
  Sparkles,
  Music,
  PartyPopper,
  Flame,
  Volume2
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

  // Estado de Música del Día del Niño
  const [isChildMusicPlaying, setIsChildMusicPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<SongInfo>(CHILDREN_SONGS[0]);

  // CRM Auth State
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin008');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Hover state
  const [hovered, setHovered] = useState<'physical' | 'digital' | null>(null);

  useEffect(() => {
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
      const isBoss = user.account_number === 'admin' || user.email === 'admin@apcr.cr' || user.email === 'admin@apcr.online';
      const role = isBoss ? 'admin' : (user.role || 'client');
      const agentName = user.contact_name || user.company_name || 'Agente';

      document.cookie = "crm_authenticated=true; path=/; max-age=604800; SameSite=Lax";
      document.cookie = `crm_role=${role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `crm_agent_name=${encodeURIComponent(agentName)}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `crm_account_number=${user.account_number || ''}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `crm_user_id=${user.id}; path=/; max-age=604800; SameSite=Lax`;

      setTimeout(() => {
        setIsLoginOpen(false);
        window.location.href = isBoss ? '/crm/admin' : '/crm';
      }, 500);
    } catch (err: any) {
      setLoginError(err.message || 'Error de conexión');
      setLoginLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none font-sans bg-gradient-to-b from-sky-100 via-amber-50 to-rose-100 text-slate-900 transition-colors duration-500">
      
      {/* DECORACIONES FESTIVAS DE FONDO DÍA DEL NIÑO (GLOBOS, CONFETI, BURBUJAS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Globos flotantes en las esquinas y laterales */}
        <div className="absolute -top-4 left-6 text-4xl sm:text-6xl animate-bounce duration-1000 opacity-90 drop-shadow-md">🎈</div>
        <div className="absolute top-12 right-8 text-3xl sm:text-5xl animate-pulse opacity-85">🎉</div>
        <div className="absolute top-1/3 -left-4 text-3xl sm:text-5xl opacity-80" style={{ animation: 'bounce 3s infinite' }}>⭐</div>
        <div className="absolute top-1/2 -right-3 text-4xl sm:text-6xl opacity-85" style={{ animation: 'bounce 4s infinite' }}>🎈</div>
        <div className="absolute bottom-24 left-10 text-3xl sm:text-4xl opacity-75">🎨</div>
        <div className="absolute bottom-28 right-12 text-3xl sm:text-5xl opacity-80">🎁</div>

        {/* Destellos y círculos de luz multicolor */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-300/30 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-400/25 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-sky-400/25 blur-3xl"></div>
      </div>

      {/* TOP BAR: BRANDING + ACCESOS */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-slate-950 flex items-center gap-1.5 font-sans">
            <span className="text-amber-500">A</span>
            <span className="text-rose-500">P</span>
            <span className="text-sky-500">C</span>
            <span className="text-emerald-500">R</span>
            <span className="text-lg">🎈</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-sm">
            Costa Rica 🇨🇷
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botón interactivo de Música Infantil */}
          <button
            onClick={handleToggleChildMusic}
            className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95 border ${
              isChildMusicPlaying 
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-white animate-pulse' 
                : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50'
            }`}
            title={isChildMusicPlaying ? 'Pausar música infantil' : 'Escuchar música infantil tradicional'}
          >
            <Music className={`w-3.5 h-3.5 ${isChildMusicPlaying ? 'animate-spin' : 'text-amber-500'}`} />
            <span>{isChildMusicPlaying ? 'SONANDO ♫' : 'MÚSICA'}</span>
          </button>

          {/* CRM Login Button */}
          <button
            onClick={handleOpenLogin}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>CRM</span>
          </button>
        </div>
      </header>

      {/* HERO BANNER FESTIVO Y COLORIDO: DÍA DEL NIÑO EN COSTA RICA (9 DE SEPTIEMBRE) */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-1 pb-2 z-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 p-1 shadow-xl shadow-rose-500/15 overflow-hidden transition-all hover:shadow-2xl">
          
          <div className="rounded-[22px] bg-white/95 backdrop-blur-md p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            {/* Lado izquierdo: Textos y Promoción Festiva */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl animate-bounce">🎈</span>
                <span className="text-base sm:text-lg font-black uppercase tracking-tight bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                  ¡Feliz Día del Niño en Costa Rica! 🇨🇷
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  9 de Septiembre
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed max-w-xl">
                ¡Celebramos la alegría de la niñez costarricense! <strong className="text-rose-600 font-black">25% de descuento especial</strong> en alfombras ergonómicas infantiles didácticas para kínder, escuelas y cuartos de juegos.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 pt-0.5 text-[11px] font-black text-slate-600">
                <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300">
                  ✨ Diseños Didácticos
                </span>
                <span className="bg-sky-100 text-sky-900 px-2.5 py-1 rounded-lg border border-sky-300">
                  🛡️ Antifatiga y Seguras
                </span>
                <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300">
                  🎨 100% Personalizadas
                </span>
              </div>
            </div>

            {/* Lado derecho: Cajita Musical Interactiva (Reproductor de Canciones de Niños) */}
            <div className="w-full md:w-auto flex-shrink-0 bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100 border-2 border-amber-300 rounded-2xl p-3 shadow-md flex items-center justify-between md:justify-start gap-3">
              <button
                onClick={handleToggleChildMusic}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                title={isChildMusicPlaying ? 'Pausar música' : 'Reproducir música'}
              >
                {isChildMusicPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="text-left min-w-[140px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 block truncate">
                    {currentSong.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/* Ecualizador animado */}
                  <div className="flex items-end gap-0.5 h-3">
                    <div className={`w-1 bg-amber-500 rounded-full transition-all duration-300 ${isChildMusicPlaying ? 'h-3 animate-pulse' : 'h-1'}`}></div>
                    <div className={`w-1 bg-rose-500 rounded-full transition-all duration-300 ${isChildMusicPlaying ? 'h-3.5 animate-bounce' : 'h-1.5'}`}></div>
                    <div className={`w-1 bg-sky-500 rounded-full transition-all duration-300 ${isChildMusicPlaying ? 'h-2 animate-pulse' : 'h-1'}`}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">
                    {isChildMusicPlaying ? '♫ Sonando marimba' : 'Pausado'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleNextSong}
                className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200 transition-all shadow-sm active:scale-90"
                title="Siguiente canción infantil"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MAIN STAGE: EXACTLY TWO MONUMENTAL LUXURY CIRCULAR EMBLEMS SOBRE FONDO CLARO CON ACENTOS COLORIDOS */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 my-auto z-10 py-6 sm:py-8">
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
              
              {/* Resplandor cálido festivo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400/20 via-rose-400/20 to-sky-400/20 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Anillo exterior arquitectónico en blanco y sombra profunda */}
              <div className="absolute inset-0 rounded-full bg-white border-4 border-amber-400/60 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.25)] transition-all duration-500 group-hover:border-amber-500 group-hover:shadow-[0_30px_70px_-10px_rgba(245,158,11,0.4)]"></div>

              {/* Micro-anillo concéntrico */}
              <div className="absolute inset-3 rounded-full border-2 border-slate-100"></div>

              {/* Medallón interno en carbono con logo invertido blanco */}
              <div className="relative w-[84%] h-[84%] rounded-full bg-[#111114] border-2 border-neutral-800 flex items-center justify-center overflow-hidden shadow-2xl p-6 group-hover:border-amber-400 transition-colors duration-500">
                <Image
                  src="/images/logos/ap-monogram-black.png"
                  alt="Productos - Alfombras"
                  width={280}
                  height={280}
                  className="w-full h-full object-contain filter invert opacity-95 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Insignia flotante festiva */}
              <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white">
                Alfombras & Diseños
              </div>
            </div>

            {/* Portal Label: 'PRODUCTOS' */}
            <div className="mt-7 text-center space-y-1">
              <span className="text-lg sm:text-xl tracking-[0.25em] uppercase font-black text-slate-950 group-hover:text-amber-600 transition-colors duration-300 block">
                PRODUCTOS
              </span>
              <span className="text-xs tracking-wider uppercase font-bold text-slate-600 block">
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
              
              {/* Resplandor multicolor festivo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-400/20 via-indigo-400/20 to-pink-400/20 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Anillo exterior a juego */}
              <div className="absolute inset-0 rounded-full bg-white border-4 border-sky-400/60 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.25)] transition-all duration-500 group-hover:border-sky-500 group-hover:shadow-[0_30px_70px_-10px_rgba(14,165,233,0.4)]"></div>

              {/* Micro-anillo concéntrico */}
              <div className="absolute inset-3 rounded-full border-2 border-slate-100"></div>

              {/* Medallón interno que alberga el logo de 4 colores */}
              <div className="relative w-[84%] h-[84%] rounded-full overflow-hidden shadow-2xl flex items-center justify-center border-2 border-neutral-200 group-hover:border-sky-500 transition-colors duration-500 bg-white">
                <Image
                  src="/images/logos/ap-circle-color.jpg"
                  alt="Software"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Insignia flotante festiva */}
              <div className="absolute -bottom-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-white">
                Suite Digital & POS
              </div>
            </div>

            {/* Portal Label: 'SOFTWARE' */}
            <div className="mt-7 text-center space-y-1">
              <span className="text-lg sm:text-xl tracking-[0.25em] uppercase font-black text-slate-950 group-hover:text-sky-600 transition-colors duration-300 block">
                SOFTWARE
              </span>
              <span className="text-xs tracking-wider uppercase font-bold text-slate-600 block">
                Suite digital & punto de venta
              </span>
            </div>
          </button>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-14 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 text-[11px] tracking-[0.18em] text-slate-600 uppercase font-bold">
        <span>© 2026 APCR COSTA RICA. CELEBRANDO EL DÍA DE LA NIÑEZ 🇨🇷</span>
        <div className="flex items-center gap-4">
          <a href="/simulador" className="hover:text-slate-950 transition-colors">
            SIMULADOR
          </a>
          <span>•</span>
          <a href="/crm/landing-pages" className="hover:text-slate-950 transition-colors">
            PORTADAS
          </a>
        </div>
      </footer>

      {/* MODAL DE LOGIN CRM */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl relative text-slate-900">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg text-white mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">Acceso Seguro CRM</h2>
              <p className="text-xs text-slate-500 mt-1">Plataforma Administrativa APCR</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Usuario o Correo
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acceso autorizado...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg mt-2"
              >
                {loginLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
