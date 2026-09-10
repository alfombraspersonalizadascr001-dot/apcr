'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  Eye, 
  CheckCircle, 
  Globe, 
  Layers, 
  ExternalLink, 
  Check, 
  SlidersHorizontal,
  Volume2,
  Code,
  Palette,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Music,
  Radio,
  Rocket,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface CoverShowcaseItem {
  id: string;
  urlParam: string;
  title: string;
  edition: string;
  badge: string;
  badgeColor: string;
  description: string;
  previewImage?: string;
  bgPreview: string;
  leftLogo: string;
  rightLogo: string;
  tags: string[];
  specs: {
    estilo: string;
    fondo: string;
    audio: string;
    tipografia: string;
    dispositivos: string;
  };
  highlights: string[];
}

export default function PortadasShowcasePage() {
  const [activeTheme, setActiveTheme] = useState<string>('minimal');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('apcr_home_theme') || 'minimal';
    setActiveTheme(saved);
  }, []);

  const handleSetActive = (id: string, name: string) => {
    setActiveTheme(id);
    localStorage.setItem('apcr_home_theme', id);

    // Guardar cookie por 30 días
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `apcr_home_theme=${id}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;

    setNotification(`¡Portada "${name}" activada como portada principal de la web!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const covers: CoverShowcaseItem[] = [
    {
      id: 'minimal',
      urlParam: 'minimal',
      title: 'Minimalista Porcelain Ivory Luxury',
      edition: 'Edición Diurna & Alto Contraste Solar',
      badge: 'PORTADA ACTUAL POR DEFECTO',
      badgeColor: 'bg-emerald-500 text-white',
      description: 'Arquitectura ultra limpia de alta gama concebida para una legibilidad 100% nítida bajo la luz solar en dispositivos móviles. Presenta dos imponentes medallones concéntricos con el logotipo negro de Productos y el logotipo cromático de Software, sin ruido visual ni distracciones.',
      bgPreview: 'bg-[#F8F9FA]',
      leftLogo: '/images/logos/ap-monogram-black.png',
      rightLogo: '/images/logos/ap-circle-color.jpg',
      tags: ['Porcelain Ivory', 'Alto Contraste', 'Minimalista', 'Mobile-First', 'Sin Distracciones'],
      specs: {
        estilo: 'Minimalismo Suizo Contemporáneo',
        fondo: '#F8F9FA Porcelana Pura & Resplandor Suave',
        audio: 'Audio háptico arcade de ultra baja latencia',
        tipografia: 'Inter / Google Sans Display',
        dispositivos: 'Optimizado para Smartphones bajo luz del sol'
      },
      highlights: [
        'Medallón de Productos en carbono obsidiana con monograma AP de alto contraste',
        'Medallón de Software en 4 cuadrantes cromáticos con anillo arquitectónico biselado',
        'Cero distracciones visuales: enfoque monumental directo en los dos mundos de negocio',
        'Top bar con branding tipográfico fino y botón rápido al portal CRM'
      ]
    },
    {
      id: 'dia-nino',
      urlParam: 'dia-nino',
      title: 'Edición Especial: Día del Niño en Costa Rica',
      edition: 'Celebración Nacional del 9 de Septiembre',
      badge: 'EDICIÓN ESPECIAL FESTIVA',
      badgeColor: 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white',
      description: 'Portada temática conmemorativa con una vibrante ilustración artística de fiesta infantil, arcoíris, globos flotantes y una cajita musical interactiva con canciones infantiles costarricenses tradicionales interpretadas en marimba sintetizada en tiempo real.',
      bgPreview: 'bg-gradient-to-b from-sky-100 via-amber-50 to-rose-100',
      leftLogo: '/images/logos/ap-monogram-black.png',
      rightLogo: '/images/logos/ap-circle-color.jpg',
      tags: ['Día del Niño CR', 'Ilustración Artística', 'Marimba Tradicional', 'Web Audio API', 'Arcoíris & Globos'],
      specs: {
        estilo: 'Festivo & Conmemorativo Infantil',
        fondo: 'Ilustración artística en alta definición (cielo, arcoíris y niños)',
        audio: 'Web Audio API nativo: Caballito Nicoyano, Los Pollitos Dicen, Arroz con Leche',
        tipografia: 'Plus Jakarta Sans & Acentos Coloridos',
        dispositivos: 'Responsive para Móvil y Pantallas Panorámicas'
      },
      highlights: [
        'Motor de síntesis de audio Web Audio API: cero dependencias externas ni enlaces rotos',
        'Reproductor interactivo de marimba con ecualizador animado en vivo',
        'Mensaje conmemorativo de felicitación oficial a la niñez costarricense',
        'Ilustración festiva de fondo con globos animados y banderas 🇨🇷'
      ]
    },
    {
      id: 'airlock',
      urlParam: 'airlock',
      title: 'Esclusa Espacial VR Inmersiva',
      edition: 'Experiencia Sci-Fi 3D & Audio Táctico',
      badge: 'EXPERIENCIA INTERACTIVA 3D',
      badgeColor: 'bg-cyan-500 text-black font-black',
      description: 'Una experiencia interactiva de ciencia ficción con compuertas hidráulicas blindadas que se separan físicamente en 3D con sonido de descompresión espacial al seleccionar Productos o Software. Incluye visor holográfico táctico y terminal espacial.',
      bgPreview: 'bg-[#040608]',
      leftLogo: '/images/logos/ap-monogram-black.png',
      rightLogo: '/images/logos/ap-circle-color.jpg',
      tags: ['Sci-Fi 3D', 'Compuertas Hidráulicas', 'Audio Espacial', 'Visor VR', 'Terminal Blindada'],
      specs: {
        estilo: 'Futurista Industrial de Alta Tecnología',
        fondo: '#040608 Bóveda Espacial Profunda & Rejilla VR',
        audio: 'Descompresión neumática y pulsadores arcade espaciales',
        tipografia: 'Orbitron & Monospace Cyberpunk',
        dispositivos: 'Computadoras de escritorio, tablets y móviles con aceleración GPU'
      },
      highlights: [
        'Compuertas blindadas que se abren mecánicamente con animación de profundidad',
        'Efectos de sonido de descompresión hidráulica en tiempo real',
        'HUD superior con visor de estado, control de volumen y conmutador de idiomas',
        'Login holográfico estilo terminal de mando aeroespacial'
      ]
    },
    {
      id: 'obsidian',
      urlParam: 'obsidian',
      title: 'Obsidian Minimalist Dark Glass',
      edition: 'Diseño Suizo Nocturno para Pantallas OLED',
      badge: 'ARQUITECTURA OBSIDIANA',
      badgeColor: 'bg-neutral-800 text-amber-400 border border-amber-500/30',
      description: 'Variante oscura de máxima sofisticación con fondo negro obsidiana (#070709). Diseñada para exhibición en salas de juntas, monitores de alta gama y pantallas OLED, donde la profundidad de los negros hace resaltar el brillo puro de los medallones.',
      bgPreview: 'bg-[#070709]',
      leftLogo: '/images/logos/ap-monogram-black.png',
      rightLogo: '/images/logos/ap-circle-color.jpg',
      tags: ['Obsidian Dark Glass', 'Pantallas OLED', 'Lujo Nocturno', 'Alta Gama', 'Bordes de Precisión'],
      specs: {
        estilo: 'Lujo Minimalista Nocturno',
        fondo: '#070709 Obsidiana Pura & Micro-Rejilla Suave',
        audio: 'Audio háptico sutil de proximidad',
        tipografia: 'Inter / Swiss Minimalist',
        dispositivos: 'Ideal para pantallas OLED, proyectores de reuniones y modo nocturno'
      },
      highlights: [
        'Contraste infinito en pantallas OLED gracias al fondo negro obsidiana puro',
        'Anillos de luz perimetrales con difuminado suave de alta definición',
        'Tipografía fina de estética corporativa suizo-alemana',
        'Portal directo y sin ruido hacia las divisiones de negocio de APCR'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* HEADER SUPERIOR */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a Inicio</span>
            </Link>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-sans">
                APCR <span className="text-amber-400">DESIGN LAB</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 hidden md:inline">
                Portafolio de Portadas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Ver Web Activa</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO HEROICO DE LA VITRINA */}
      <section className="relative overflow-hidden pt-12 pb-14 px-4 sm:px-8 border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-slate-300">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>EXHIBICIÓN DE ARQUITECTURA & DISEÑO INTERACTIVO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Todas las Portadas Oficiales de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400">APCR</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Aquí guardamos y exponemos cada concepto de portada que hemos diseñado y subido para la web de APCR. Cada cliente o visitante puede explorar y probar interactivamente cómo cada diseño habla del nivel de calidad, innovación y tecnología que podemos crear.
          </p>

          {/* Notificación flotante de activación */}
          {notification && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in zoom-in duration-300 shadow-xl">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
          )}
        </div>
      </section>

      {/* LISTA PRINCIPAL DE PORTADAS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {covers.map((c, index) => {
            const isCurrentlyActive = activeTheme === c.id;

            return (
              <div 
                key={c.id}
                className={`rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-2xl relative ${
                  isCurrentlyActive 
                    ? 'border-amber-400 bg-slate-900/90 ring-2 ring-amber-400/20 shadow-amber-500/10' 
                    : 'border-white/10 bg-slate-900/60 hover:border-white/30'
                }`}
              >
                {/* PREVIEW VISUAL HEADER */}
                <div className={`relative h-64 sm:h-72 w-full p-6 flex flex-col justify-between overflow-hidden border-b border-white/10 ${c.bgPreview}`}>
                  
                  {/* Top Bar de la maqueta */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-black/70 text-white backdrop-blur-md">
                      #{index + 1} // {c.id.toUpperCase()}
                    </span>

                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  {/* Dual Emblem Mockup Visual */}
                  <div className="relative z-10 flex items-center justify-center gap-8 sm:gap-12 my-auto">
                    {/* Botón Izquierdo Productos */}
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#111114] border-2 border-white/20 p-2 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                        <Image
                          src={c.leftLogo}
                          alt="Productos"
                          width={80}
                          height={80}
                          className="w-full h-full object-contain filter invert opacity-95"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                        PRODUCTOS
                      </span>
                    </div>

                    {/* Botón Derecho Software */}
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-white/20 p-1 shadow-2xl flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
                        <Image
                          src={c.rightLogo}
                          alt="Software"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/90 px-2 py-0.5 rounded shadow-sm">
                        SOFTWARE
                      </span>
                    </div>
                  </div>

                  {/* Pie de la maqueta con tag */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-800 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg">
                    <span>{c.edition}</span>
                    <span className="font-bold text-blue-600">/?v={c.urlParam}</span>
                  </div>
                </div>

                {/* CONTENIDO DESCRIPTIVO */}
                <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {c.title}
                      </h3>
                      {isCurrentlyActive && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          ACTIVA EN PRODUCCIÓN
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {c.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Especificaciones de Diseño */}
                    <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Estilo:</span>
                        <span className="font-semibold text-white">{c.specs.estilo}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Fondo:</span>
                        <span className="font-mono text-[11px] text-amber-300 truncate max-w-[240px]">{c.specs.fondo}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Audio / Efectos:</span>
                        <span className="text-slate-200">{c.specs.audio}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Enfoque:</span>
                        <span className="text-slate-300">{c.specs.dispositivos}</span>
                      </div>
                    </div>

                    {/* Puntos destacados */}
                    <ul className="space-y-1.5 pt-2 text-xs text-slate-300">
                      {c.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <Link
                      href={`/?v=${c.urlParam}`}
                      target="_blank"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Probar en Vivo</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </Link>

                    <button
                      onClick={() => handleSetActive(c.id, c.title)}
                      className={`w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        isCurrentlyActive
                          ? 'bg-white/10 text-slate-400 cursor-default border border-white/10'
                          : 'bg-white/5 hover:bg-white/15 text-white border border-white/20'
                      }`}
                    >
                      {isCurrentlyActive ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Es la Portada Activa</span>
                        </>
                      ) : (
                        <>
                          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                          <span>Poner como Principal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 py-8 px-4 sm:px-8 text-center text-xs text-slate-400 font-mono">
        <p>© 2026 ALFOMBRAS PERSONALIZADAS DE COSTA RICA (APCR). TODOS LOS DERECHOS RESERVADOS.</p>
        <p className="text-[11px] text-slate-600 mt-1">Innovación, Fabricación & Software en Costa Rica 🇨🇷</p>
      </footer>

    </div>
  );
}
