"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { airlockAudio } from '../utils/airlockSound';
import { Volume2, VolumeX, Lock, X, CheckCircle2 } from 'lucide-react';
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

  // CRM Auth State
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin008');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Subtle ambient glow on hover
  const [hovered, setHovered] = useState<'physical' | 'digital' | null>(null);

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
    <div className="min-h-screen flex flex-col justify-between select-none relative bg-[#09090b] text-[#e5e5ea] font-sans overflow-x-hidden">
      {/* Ambient Quiet Depth Glow inspired by Stitch Executive Design */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: hovered === 'physical'
            ? 'radial-gradient(circle 700px at 30% 50%, rgba(255, 255, 255, 0.04) 0%, rgba(9, 9, 11, 0) 100%)'
            : hovered === 'digital'
            ? 'radial-gradient(circle 700px at 70% 50%, rgba(255, 248, 235, 0.04) 0%, rgba(9, 9, 11, 0) 100%)'
            : 'radial-gradient(circle 600px at 50% 50%, rgba(255, 248, 235, 0.025) 0%, rgba(9, 9, 11, 0) 100%)'
        }}
      />

      {/* HEADER: Minimal Executive HUD */}
      <header className="w-full max-w-7xl mx-auto px-8 sm:px-14 pt-8 pb-6 flex items-center justify-between z-20">
        {/* Brand Wordmark */}
        <div className="cursor-pointer">
          <span className="text-[13px] tracking-[0.38em] font-medium text-white/90 uppercase hover:text-white transition-opacity duration-300">
            APCR
          </span>
        </div>

        {/* Actions: Sound & CRM Access */}
        <div className="flex items-center space-x-6 text-[11px] tracking-[0.26em] uppercase font-light text-neutral-400">
          <button 
            onClick={handleSoundToggle}
            className="hover:text-white transition-colors duration-300 flex items-center space-x-2"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isMuted ? 'bg-neutral-600' : 'bg-neutral-300'}`}></span>
            <span className="text-neutral-400 hover:text-white tracking-[0.25em]">SOUND</span>
          </button>

          <button 
            onClick={handleOpenLogin}
            className="hover:text-white transition-colors duration-300 tracking-[0.25em] text-neutral-400 flex items-center gap-1.5"
          >
            <Lock className="w-3 h-3 text-neutral-500" />
            CRM
          </button>
        </div>
      </header>

      {/* MAIN STAGE: EXACTLY TWO MONUMENTAL LUXURY CIRCULAR EMBLEMS */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 my-auto z-10 py-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-14 md:gap-24 lg:gap-32">
          
          {/* ========================================================
              PORTAL 01: PRODUCTOS (ALFOMBRAS CON LOGO EN NEGRO)
             ======================================================== */}
          <button
            type="button"
            onMouseEnter={() => setHovered('physical')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handlePortalChoice('physical')}
            className="group flex flex-col items-center no-underline focus:outline-none transition-transform duration-700 hover:scale-[1.03]"
          >
            {/* Monumental Circular Medallion */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[340px] lg:h-[340px] rounded-full flex items-center justify-center transition-all duration-700">
              {/* Outer Whisper-thin Halo */}
              <div className="absolute -inset-4 rounded-full bg-white/[0.015] blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Outer Architectural Bevel Ring */}
              <div className="absolute inset-0 rounded-full border border-white/[0.08] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] transition-colors duration-700 group-hover:border-white/[0.22]"></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className="absolute inset-3 rounded-full border border-white/[0.03]"></div>

              {/* Internal Medallion Housing the Black Logo */}
              <div className="relative w-[84%] h-[84%] rounded-full bg-[#111114] border border-white/[0.08] flex items-center justify-center overflow-hidden shadow-2xl p-6 group-hover:border-white/[0.25] transition-colors duration-500">
                <Image
                  src="/images/logos/ap-monogram-black.png"
                  alt="Productos - Alfombras"
                  width={280}
                  height={280}
                  className="w-full h-full object-contain filter invert opacity-90 transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Portal Label: ONLY 'PRODUCTOS' */}
            <div className="mt-8 text-center">
              <span className="text-sm tracking-[0.35em] uppercase font-light text-neutral-400 group-hover:text-white transition-colors duration-500">
                PRODUCTOS
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
            className="group flex flex-col items-center no-underline focus:outline-none transition-transform duration-700 hover:scale-[1.03]"
          >
            {/* Monumental Circular Medallion */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[340px] lg:h-[340px] rounded-full flex items-center justify-center transition-all duration-700">
              {/* Outer Whisper-thin Halo */}
              <div className="absolute -inset-4 rounded-full bg-white/[0.015] blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Matching Luxury Outer Bevel Frame */}
              <div className="absolute inset-0 rounded-full border border-white/[0.08] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] transition-colors duration-700 group-hover:border-white/[0.22]"></div>

              {/* Secondary Micro-concentric Hairline */}
              <div className="absolute inset-3 rounded-full border border-white/[0.03]"></div>

              {/* Internal Medallion Housing the 4-Color Logo */}
              <div className="relative w-[84%] h-[84%] rounded-full overflow-hidden shadow-[0_25px_65px_-12px_rgba(0,0,0,0.9)] flex items-center justify-center border border-white/10 group-hover:border-white/25 transition-colors duration-500">
                <Image
                  src="/images/logos/ap-circle-color.jpg"
                  alt="Software"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Portal Label: ONLY 'SOFTWARE' */}
            <div className="mt-8 text-center">
              <span className="text-sm tracking-[0.35em] uppercase font-light text-neutral-400 group-hover:text-white transition-colors duration-500">
                SOFTWARE
              </span>
            </div>
          </button>

        </div>
      </main>

      {/* FOOTER: Pure Executive Minimal Elegance */}
      <footer className="w-full max-w-7xl mx-auto px-8 sm:px-14 py-8 flex items-center justify-between z-20 text-[10px] tracking-[0.2em] text-neutral-500 uppercase font-light">
        <span>© APCR. ALL RIGHTS RESERVED.</span>
        <a href="/crm/landing-pages" className="hover:text-neutral-300 transition-colors">
          PORTADAS
        </a>
      </footer>

      {/* HOLOGRAPHIC MINIMAL LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xs rounded-2xl bg-[#111114] border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs tracking-[0.25em] text-neutral-300 uppercase">ACCESO CRM</span>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Usuario"
                required
                className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 focus:border-white text-white text-xs focus:outline-none transition-colors"
              />

              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 focus:border-white text-white text-xs focus:outline-none transition-colors"
              />

              {loginError && (
                <div className="text-red-400 text-[11px]">
                  {loginError}
                </div>
              )}

              {loginSuccess && (
                <div className="text-emerald-400 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Acceso concedido
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2 rounded-lg bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {loginLoading ? '...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
