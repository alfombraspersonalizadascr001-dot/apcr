'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { airlockAudio } from '../utils/airlockSound';
import { 
  Lock, 
  X, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MinimalistPortalProps {
  onEnterWorld: (world: 'physical' | 'digital') => void;
  currentWorld?: 'portal' | 'physical' | 'digital' | 'split';
  onReturnToPortal?: () => void;
  lang?: 'es' | 'en';
  onToggleLang?: (lang: 'es' | 'en') => void;
  variant?: 'light' | 'obsidian';
}

export const MinimalistPortal: React.FC<MinimalistPortalProps> = ({
  onEnterWorld,
  variant = 'light'
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // CRM Auth State
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin008');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Hover state
  const [hovered, setHovered] = useState<'physical' | 'digital' | null>(null);

  const isDark = variant === 'obsidian';

  const handleOpenLogin = () => {
    try {
      airlockAudio.playArcadeButtonPress();
    } catch {}
    setIsLoginOpen(true);
  };

  const handlePortalChoice = (world: 'physical' | 'digital') => {
    try {
      airlockAudio.playArcadeButtonPress();
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
    <div className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none font-sans transition-colors duration-500 ${
      isDark 
        ? 'bg-[#070709] text-white' 
        : 'bg-[#F8F9FA] text-[#111114]'
    }`}>
      
      {/* Background Architectural Rings / Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Soft Ambient Radiance */}
        <div className={`w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full blur-3xl transition-opacity duration-700 ${
          isDark ? 'bg-white/[0.015]' : 'bg-slate-200/40'
        }`} />
      </div>

      {/* TOP BAR: BRANDING + ACCESO CRM */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-5 sm:py-7 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2.5">
          <span className={`text-xl sm:text-2xl font-black tracking-tight font-sans flex items-center gap-1 ${
            isDark ? 'text-white' : 'text-[#111114]'
          }`}>
            <span>APCR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mb-1"></span>
          </span>
          <span className={`text-[9px] font-mono uppercase tracking-[0.25em] px-2 py-0.5 rounded border ${
            isDark 
              ? 'border-white/10 text-neutral-400 bg-white/5' 
              : 'border-neutral-200 text-neutral-500 bg-neutral-100'
          }`}>
            COSTA RICA
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Link a Galería de Portadas */}
          <Link
            href="/portadas"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm active:scale-95 ${
              isDark
                ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:border-white/30'
                : 'bg-white border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-900'
            }`}
            title="Ver catálogo de todas las portadas creadas"
          >
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">VER</span>
            <span>PORTADAS</span>
          </Link>

          {/* CRM Login Button */}
          <button
            onClick={handleOpenLogin}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm active:scale-95 ${
              isDark
                ? 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black'
                : 'bg-[#111114] border-[#111114] text-white hover:bg-neutral-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>CRM</span>
          </button>
        </div>
      </header>

      {/* MAIN STAGE: EXACTLY TWO MONUMENTAL LUXURY CIRCULAR EMBLEMS */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 my-auto z-10 py-10 sm:py-16">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 sm:gap-16 md:gap-24 lg:gap-32">
          
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
            {/* Monumental Circular Medallion */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[330px] lg:h-[330px] rounded-full flex items-center justify-center transition-all duration-500">
              
              {/* Outer Daylight Halo */}
              <div className={`absolute -inset-4 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 ${
                isDark ? 'bg-white/[0.04]' : 'bg-neutral-950/[0.06]'
              }`}></div>

              {/* Outer Architectural Bevel Ring */}
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-[#111114] border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] group-hover:border-white/30' 
                  : 'bg-white border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] group-hover:border-neutral-950 group-hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.25)]'
              }`}></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className={`absolute inset-3 rounded-full border ${
                isDark ? 'border-white/[0.04]' : 'border-neutral-200'
              }`}></div>

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

            {/* Portal Label: 'PRODUCTOS' */}
            <div className="mt-7 text-center space-y-1">
              <span className={`text-base sm:text-lg tracking-[0.3em] uppercase font-bold transition-colors duration-300 block ${
                isDark 
                  ? 'text-neutral-300 group-hover:text-white' 
                  : 'text-[#111114] group-hover:text-amber-600'
              }`}>
                PRODUCTOS
              </span>
              <span className={`text-[11px] tracking-wider uppercase font-mono block ${
                isDark ? 'text-neutral-500' : 'text-neutral-500'
              }`}>
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
              <div className="absolute -inset-4 rounded-full bg-blue-600/[0.08] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Matching Outer Bevel Frame */}
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                isDark 
                  ? 'bg-[#111114] border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] group-hover:border-blue-500/50' 
                  : 'bg-white border-neutral-300/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] group-hover:border-blue-600 group-hover:shadow-[0_30px_70px_-10px_rgba(0,43,127,0.22)]'
              }`}></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className={`absolute inset-3 rounded-full border ${
                isDark ? 'border-white/[0.04]' : 'border-neutral-200'
              }`}></div>

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

            {/* Portal Label: 'SOFTWARE' */}
            <div className="mt-7 text-center space-y-1">
              <span className={`text-base sm:text-lg tracking-[0.3em] uppercase font-bold transition-colors duration-300 block ${
                isDark 
                  ? 'text-neutral-300 group-hover:text-white' 
                  : 'text-[#111114] group-hover:text-blue-600'
              }`}>
                SOFTWARE
              </span>
              <span className={`text-[11px] tracking-wider uppercase font-mono block ${
                isDark ? 'text-neutral-500' : 'text-neutral-500'
              }`}>
                Suite digital & punto de venta
              </span>
            </div>
          </button>

        </div>
      </main>

      {/* FOOTER */}
      <footer className={`w-full max-w-7xl mx-auto px-6 sm:px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 text-[11px] tracking-[0.18em] uppercase font-medium ${
        isDark ? 'text-neutral-500' : 'text-neutral-500'
      }`}>
        <span>© 2026 APCR COSTA RICA. TODOS LOS DERECHOS RESERVADOS.</span>
        <div className="flex items-center gap-4">
          <Link href="/simulador" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
            SIMULADOR
          </Link>
          <span>•</span>
          <Link href="/portadas" className={`transition-colors font-bold ${isDark ? 'text-amber-400 hover:text-white' : 'text-amber-600 hover:text-black'}`}>
            GALERÍA DE PORTADAS
          </Link>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className={`relative w-full max-w-xs rounded-2xl p-6 shadow-2xl border ${
              isDark ? 'bg-[#111114] border-white/10 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <span className="text-xs tracking-[0.25em] font-bold uppercase">ACCESO CRM</span>
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
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-black border-white/10 focus:border-white text-white' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-black text-neutral-900'
                  }`}
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
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-black border-white/10 focus:border-white text-white' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-black text-neutral-900'
                  }`}
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
                className={`w-full py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors disabled:opacity-50 mt-2 ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-[#111114] text-white hover:bg-neutral-800'
                }`}
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
