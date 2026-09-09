'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SidebarLayout from '../components/SidebarLayout';
import { 
  Sparkles, 
  Eye, 
  CheckCircle, 
  Globe, 
  Layers, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  SlidersHorizontal,
  Volume2,
  Code,
  Palette,
  Laptop,
  ArrowRight,
  Info
} from 'lucide-react';

interface LandingPageOption {
  id: 'minimal' | 'airlock';
  title: string;
  category: string;
  badge: string;
  description: string;
  previewUrl: string;
  imageLeft: string;
  imageRight: string;
  accentColor: string;
  accentBg: string;
  tags: string[];
  features: string[];
  designSpecs: {
    font: string;
    background: string;
    audio: string;
    style: string;
  };
}

export default function LandingPagesManagerPage() {
  const [activeTheme, setActiveTheme] = useState<'minimal' | 'airlock'>('minimal');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load current active landing page theme
    const saved = localStorage.getItem('apcr_home_theme') as 'minimal' | 'airlock';
    if (saved === 'airlock' || saved === 'minimal') {
      setActiveTheme(saved);
    }
  }, []);

  const handleSetActive = (id: 'minimal' | 'airlock') => {
    setActiveTheme(id);
    localStorage.setItem('apcr_home_theme', id);

    // Set cookie for 30 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `apcr_home_theme=${id}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    setSuccessMessage(`¡Portada "${id === 'minimal' ? 'Minimalista Obsidian' : 'Esclusa Espacial VR'}" activada como portada principal de la web!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const landingPages: LandingPageOption[] = [
    {
      id: 'minimal',
      title: 'Obsidian Minimalist Luxury (Doble Emblema Circular)',
      category: 'Diseño Suizo & Alta Gama',
      badge: 'NUEVA // STITCH DESIGN',
      description: 'Concepto hiper-minimalista de arquitectura de lujo. Cuenta con fondo obsidian (#070709), micro-rejilla de telemetría y dos portales circulares concéntricos con los logotipos oficiales de PRODUCTOS y SOFTWARE.',
      previewUrl: '/?v=minimal',
      imageLeft: '/images/logos/ap-monogram-black.png',
      imageRight: '/images/logos/ap-circle-color.jpg',
      accentColor: 'text-amber-500',
      accentBg: 'bg-amber-500/10 border-amber-500/30',
      tags: ['Minimalista', 'Logos Circulares', 'Obsidian Dark Glass', 'Sonido Procedural', 'Modal Login'],
      features: [
        'Emblema circular 4 cuadrantes para Productos con anillos concéntricos',
        'Emblema circular monograma negro para Software en medallón contrastado',
        'Top HUD con telemetría en vivo, conmutador de idiomas (ES/EN) y ecualizador de audio',
        'Modal holográfico de autenticación directa con Supabase y credenciales precargadas',
        'Micro-métricas arquitectónicas en el footer y diseño 100% responsivo'
      ],
      designSpecs: {
        font: 'Inter / Swiss Typography',
        background: '#070709 Obsidian Deep',
        audio: 'Audio Procedural & Proximidad',
        style: 'Modern Architectural Luxury'
      }
    },
    {
      id: 'airlock',
      title: 'Esclusa Espacial VR (Puertas Blindadas & Visor)',
      category: 'Sci-Fi Inmersivo',
      badge: 'CLÁSICA FAVORITA',
      description: 'Experiencia interactiva cinematográfica con visor de realidad virtual y compuertas hidráulicas blindadas que se abren con efectos de sonido de descompresión al seleccionar Productos o Software.',
      previewUrl: '/?v=airlock',
      imageLeft: '/images/logos/ap-monogram-black.png',
      imageRight: '/images/logos/ap-circle-color.jpg',
      accentColor: 'text-cyan-500',
      accentBg: 'bg-cyan-500/10 border-cyan-500/30',
      tags: ['Sci-Fi', 'Puertas Corredizas', 'Sonido Hidráulico', 'Visor VR', 'Animaciones CSS'],
      features: [
        'Compuertas blindadas corredizas que se separan físicamente en 3D',
        'Audio estéreo con descompresión de esclusa y pulsadores arcade',
        'Visor holográfico central con interfaz táctica de combate y radar',
        'Modal de login integrado estilo terminal espacial de alta seguridad',
        'Botones superiores con ducking de audio por distancia del cursor'
      ],
      designSpecs: {
        font: 'Orbitron / Mono Spaced',
        background: '#040608 Deep Space Vault',
        audio: 'Sintetizador Web Audio API',
        style: 'Futuristic Industrial VR'
      }
    }
  ];

  return (
    <SidebarLayout 
      title="Gestión de Portadas Web" 
      badge="GALERÍA" 
      badgeColor="indigo"
      activeModule="landing-pages"
    >
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* TOP BANNER & EXPLANATION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 p-8 text-white border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                SISTEMA MULTI-PORTADA DINÁMICO
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Galería y Control de Portadas de Inicio
              </h1>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Todas las portadas que creamos quedan guardadas aquí de forma permanente. Puedes previsualizarlas con 1 clic en una nueva pestaña o alternar cuál de ellas es la portada principal activa para cualquier visitante que entre a <span className="font-mono text-blue-300">apcr.cr / apcr.online</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                Ver Web Principal
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>
          </div>
        </div>

        {/* NOTIFICATION MESSAGE */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STATUS BAR */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-muted-foreground">
              Portada Actualmente Activa para Visitantes:
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase">
              {activeTheme === 'minimal' ? 'Minimalista Obsidian Luxury' : 'Esclusa Espacial VR'}
            </span>
          </div>

          <span className="text-xs text-muted-foreground font-mono hidden md:inline">
            Almacenado en: localStorage & cookies
          </span>
        </div>

        {/* LIST OF SAVED LANDING PAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {landingPages.map((lp) => {
            const isCurrentlyActive = activeTheme === lp.id;

            return (
              <div 
                key={lp.id}
                className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                  isCurrentlyActive 
                    ? 'bg-card border-blue-500 shadow-blue-500/10 ring-2 ring-blue-500/20' 
                    : 'bg-card/70 border-border hover:border-slate-400 dark:hover:border-zinc-700'
                }`}
              >
                {/* Visual Preview Box */}
                <div className="relative h-64 w-full bg-[#070709] border-b border-border/50 p-6 flex flex-col justify-between overflow-hidden">
                  {/* Decorative background grid */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Top Bar inside preview */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                      PREVISUALIZACIÓN // {lp.id.toUpperCase()}
                    </span>
                    {isCurrentlyActive ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        ACTIVA
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800/80 border border-white/10 text-zinc-400 text-xs font-medium">
                        DISPONIBLE
                      </span>
                    )}
                  </div>

                  {/* Dual Emblem Mockup in center */}
                  <div className="relative z-10 flex items-center justify-center gap-8 my-auto">
                    {/* Left Portal Mockup */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-20 h-20 rounded-full border border-amber-400/50 p-1 bg-zinc-900 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                        <Image
                          src={lp.imageLeft}
                          alt="Productos"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="font-mono text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        PRODUCTOS
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-[1px] bg-white/20"></div>

                    {/* Right Portal Mockup */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-20 h-20 rounded-full border border-cyan-400/50 p-1 bg-white shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Image
                          src={lp.imageRight}
                          alt="Software"
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                        SOFTWARE
                      </span>
                    </div>
                  </div>

                  {/* Bottom info inside preview */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>{lp.designSpecs.style}</span>
                    <span className="text-zinc-500">{lp.designSpecs.background}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full ${lp.accentBg} ${lp.accentColor}`}>
                        {lp.badge}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {lp.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {lp.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lp.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lp.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Features list */}
                    <div className="pt-3 border-t border-border space-y-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                        Características Clave:
                      </span>
                      <ul className="space-y-1.5">
                        {lp.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                    {/* Live Preview Button */}
                    <Link
                      href={lp.previewUrl}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-xs uppercase tracking-wider transition-colors border border-border"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      Previsualizar en Vivo
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    {/* Set Active Button */}
                    <button
                      onClick={() => handleSetActive(lp.id)}
                      disabled={isCurrentlyActive}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                        isCurrentlyActive
                          ? 'bg-emerald-600/20 text-emerald-600 border border-emerald-500/40 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                      }`}
                    >
                      {isCurrentlyActive ? (
                        <>
                          <Check className="w-4 h-4" />
                          Portada Activa
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Activar como Principal
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* FUTURE LANDING PAGES PLACEHOLDER */}
          <div className="rounded-3xl border-2 border-dashed border-border p-8 flex flex-col items-center justify-center text-center space-y-4 bg-card/30">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                ¿Deseas crear una nueva portada?
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Puedes pedirnos cualquier nuevo estilo o concepto de diseño (ej. Editorial Blanca, 3D Interactivo, Video Cinemático) y se registrará automáticamente en este panel.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-mono">
              Capacidad: Ilimitada de portadas
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
