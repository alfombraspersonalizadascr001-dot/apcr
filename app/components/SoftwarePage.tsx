import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Smartphone, 
  Calendar, 
  Utensils,
  ChefHat,
  Store,
  QrCode, 
  Database,
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowLeft, 
  Mail, 
  MapPin,
  Maximize2,
  X,
  Sparkles,
  Play,
  RotateCcw,
  Menu,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { airlockAudio } from '../utils/airlockSound';

interface SoftwarePageProps {
  onReturnToPortal: () => void;
  lang?: 'es' | 'en';
  onToggleLang?: (lang: 'es' | 'en') => void;
}

interface DemoApp {
  id: string;
  slug: string;
  name: string;
  category: 'fitness' | 'gastro' | 'health' | 'taller' | 'auto' | 'travel' | 'beauty';
  categoryLabel: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  accentBg: string;
  accentText: string;
  icon: string;
}

const DEMO_APPS: DemoApp[] = [
  {
    id: 'salon-app',
    slug: 'salon-app',
    name: 'GLOW // Salón de Belleza & Hair Atelier',
    category: 'beauty',
    categoryLabel: 'Belleza & Estética (App Móvil)',
    badge: 'App Android & iOS para Salones & Spas',
    tagline: 'Citas en Vivo, Selección de Estilista, Tarjeta VIP de Sellos & Lookbook',
    description: 'Aplicación móvil nativa (Android & iOS) con diseño chic minimalista en tonos blanco, arena y oro rosado: permite a las clientas elegir a su estilista favorita con foto y valoración, reservar citas en vivo, ver el catálogo de balayage y uñas con fotos reales, y acumular sellos en su tarjeta VIP de fidelidad.',
    features: ['Agendamiento de citas en tiempo real con especialista', 'Tarjeta digital de sellos y puntos de lealtad (Fidelización)', 'Lookbook interactivo de colorimetría y nail art', 'Recordatorios automáticos y confirmación por WhatsApp'],
    color: '#f43f5e',
    accentBg: 'bg-rose-500/10 border-rose-500/30',
    accentText: 'text-rose-400',
    icon: '💅'
  },
  {
    id: 'travel-app',
    slug: 'travel-app',
    name: 'VAGAMUNDO // Agencia de Viajes & Turismo VIP',
    category: 'travel',
    categoryLabel: 'Turismo & Viajes (App Móvil)',
    badge: 'App Android & iOS para Pasajeros',
    tagline: 'Paquetes VIP, Itinerario en Vivo, Boarding Pass QR & Concierge 24/7',
    description: 'La aplicación móvil definitiva para agencias de viajes boutique y mayoristas: sus clientes exploran paquetes (Cancún, Europa, Cruceros, Japón), cotizan viajes a la medida con cuotas mensuales, siguen su itinerario de vuelos en vivo con pase de abordar QR y reciben asistencia concierge 24/7 en español.',
    features: ['Explorador de paquetes vacacionales con doble moneda ($ y ₡)', 'Itinerario interactivo día por día con vuelos en tiempo real', 'Bóveda digital de pases de abordar QR, vouchers de hotel y seguros', 'Cotizador a la medida en cuotas y chat concierge por WhatsApp'],
    color: '#06b6d4',
    accentBg: 'bg-cyan-500/10 border-cyan-500/30',
    accentText: 'text-cyan-400',
    icon: '✈️'
  },
  {
    id: 'auto-app',
    slug: 'auto-app',
    name: 'APEX Auto // Taller & Servicio Automotriz',
    category: 'auto',
    categoryLabel: 'Automotriz & Taller (App Móvil)',
    badge: 'App Android & iOS para Clientes',
    tagline: 'Garaje Digital, Citas en Línea, Bahía en Vivo & Auxilio SOS',
    description: 'Aplicación móvil nativa (Android & iOS) con diseño premium y minimalista en fondo claro con negro, gris y rojo: el cliente consulta la telemetría de su auto, agenda citas de taller, ve fotos y progreso de su vehículo en bahía en tiempo real y solicita grúa SOS.',
    features: ['Diseño premium minimalista en blanco, negro y rojo', 'Seguimiento de bahía en taller con fotos en vivo', 'Agendamiento de citas con Servicio Valet', 'Bitácora digital de mantenimiento y auxilio SOS 24/7'],
    color: '#dc2626',
    accentBg: 'bg-red-500/10 border-red-500/30',
    accentText: 'text-red-500',
    icon: '🏎️'
  },
  {
    id: 'aura-club',
    slug: 'aura-club',
    name: 'AURA Luxury Fitness & Wellness',
    category: 'fitness',
    categoryLabel: 'Fitness & Ultra-Lujo',
    badge: 'Club Boutique & Spa VIP',
    tagline: 'Membresías VIP, Hot Yoga, Reformer Pilates & Sanctuary',
    description: 'Plataforma boutique de ultra-lujo para clubes privados y wellness: reserva de spots en Reformer y Hot Yoga, carné VIP con QR dinámico, perfil de socios Founding Black y analíticas de aforo en tiempo real.',
    features: ['Reserva de spots en Reformer y Yoga', 'Carné digital de socio VIP con QR', 'Modo Admin / Métricas del Club', 'Diseño oscuro ultra-premium'],
    color: '#10b981',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    accentText: 'text-emerald-400',
    icon: '✨'
  },
  {
    id: 'crossfit',
    slug: 'crossfit',
    name: 'Titan CrossFit Box',
    category: 'fitness',
    categoryLabel: 'Fitness & Box',
    badge: 'Atletas & Head Coach',
    tagline: 'App para Atletas, WOD del Día & Reservas en Vivo',
    description: 'Sistema completo para centros de CrossFit y entrenamiento funcional: pizarra digital de WODs, reserva de cupos por horario, leaderboard en tiempo real y control de mensualidades.',
    features: ['WOD del día interactivo', 'Reserva de cupos en vivo', 'Leaderboard y marcas de atletas', 'Notificaciones de vencimiento'],
    color: '#f97316',
    accentBg: 'bg-orange-500/10 border-orange-500/30',
    accentText: 'text-orange-400',
    icon: '🏋️'
  },
  {
    id: 'gym',
    slug: 'gym',
    name: 'Pulse Fitness Club',
    category: 'fitness',
    categoryLabel: 'Fitness & Gimnasio',
    badge: 'Gimnasio Comercial',
    tagline: 'Membresías, Clases Grupales & Rutinas Interactivas',
    description: 'Gestión ágil para gimnasios comerciales: catálogo de clases grupales (Spinning, Yoga, Funcional), control de aforo por hora, planes de membresía y carné digital QR en celular.',
    features: ['Carné digital en celular', 'Reserva de clases grupales', 'Rutinas en video por nivel', 'Control de acceso por QR'],
    color: '#2563eb',
    accentBg: 'bg-blue-500/10 border-blue-500/30',
    accentText: 'text-blue-400',
    icon: '⚡'
  },
  {
    id: 'burger',
    slug: 'burger',
    name: 'Crave Burger',
    category: 'gastro',
    categoryLabel: 'Gastronomía & QSR',
    badge: 'Cadena de Hamburguesas',
    tagline: 'Menú Digital, Pedidos a Cocina & Cero Comisiones',
    description: 'Plataforma para cadenas de comida rápida y fast-casual: pedidos directos a cocina (KDS), personalización de ingredientes, número de mesa y pago directo vía SINPE Móvil sin comisiones del 30%.',
    features: ['0% comisiones a apps terceras', 'Despacho directo a pantalla cocina', 'Personalizador de hamburguesas', 'Pago SINPE Móvil integrado'],
    color: '#dc2626',
    accentBg: 'bg-red-500/10 border-red-500/30',
    accentText: 'text-red-400',
    icon: '🍔'
  },
  {
    id: 'italian',
    slug: 'italian',
    name: 'Aurelio Ristorante & Enoteca',
    category: 'gastro',
    categoryLabel: 'Gastronomía & Alta Cocina',
    badge: 'Ristorante di Lusso',
    tagline: 'Carta de Vinos, Maridaje & Reserva de Mesas VIP',
    description: 'Experiencia gastronómica de alta gama: carta de vinos interactiva con notas de cata y maridaje, reserva de mesas por salón y menú degustación multisensorial para comensales exigentes.',
    features: ['Carta de vinos con notas de cata', 'Reserva de mesas exclusivas', 'Menú degustación por tiempos', 'Diseño visual de lujo'],
    color: '#d97706',
    accentBg: 'bg-amber-500/10 border-amber-500/30',
    accentText: 'text-amber-400',
    icon: '🍷'
  },
  {
    id: 'soda-rosa',
    slug: 'soda-rosa',
    name: 'Doña Rosa Soda Tradicional',
    category: 'gastro',
    categoryLabel: 'Gastronomía & Sodas',
    badge: 'Soda Típica de Barrio',
    tagline: 'Menú Típico, Casados del Día & WhatsApp Directo',
    description: 'App ultraligera diseñada para negocios tradicionales costarricenses: desayuno típico, casados con opciones de carnes y frescos naturales, enviando la orden limpia y formateada a WhatsApp.',
    features: ['Casados del día configurables', 'Envío de comanda directo a WhatsApp', 'Carga ultrarrápida en celulares viejos', 'Facilidad de uso para dueños'],
    color: '#059669',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    accentText: 'text-emerald-400',
    icon: '🍲'
  },
  {
    id: 'fonda-carmen',
    slug: 'fonda-carmen',
    name: 'Doña Carmen Fonda & Cocina',
    category: 'gastro',
    categoryLabel: 'Gastronomía & Catering',
    badge: 'Fonda & Almuerzos Ejecutivos',
    tagline: 'Almuerzos Ejecutivos, Delivery Local & Menú Cambiante',
    description: 'Solución para fondas y negocios de comida corrida: menú ejecutivo diario que cambia con un clic, pedidos anticipados para empresas y cálculo de envío según distancia.',
    features: ['Menú del día actualizable en segundos', 'Pedidos corporativos programados', 'Cálculo de delivery local', 'Confirmación automática'],
    color: '#ea580c',
    accentBg: 'bg-orange-500/10 border-orange-500/30',
    accentText: 'text-orange-400',
    icon: '🍛'
  },
  {
    id: 'dental',
    slug: 'dental',
    name: 'Lumina Dental Clinic',
    category: 'health',
    categoryLabel: 'Salud & Odontología',
    badge: 'Clínica Dental Boutique',
    tagline: 'Agendamiento Web, Recordatorios WhatsApp & Ficha Digital',
    description: 'Plataforma para odontólogos y clínicas médicas: selección de especialista y horario en vivo, recordatorios automáticos 24h y 2h antes por WhatsApp, y galería interactiva de casos clínicos.',
    features: ['Reserva de citas en tiempo real', 'Recordatorios por WhatsApp sin tocar el móvil', 'Catálogo de estética y ortodoncia', 'Reducción del 80% de inasistencias'],
    color: '#0284c7',
    accentBg: 'bg-sky-500/10 border-sky-500/30',
    accentText: 'text-sky-400',
    icon: '🦷'
  },
  {
    id: 'plastic-surgery',
    slug: 'plastic-surgery',
    name: 'Aurea Aesthetic & Surgery',
    category: 'health',
    categoryLabel: 'Salud & Estética VIP',
    badge: 'Cirugía & Haute Couture',
    tagline: 'Catálogo Confidencial, Agenda VIP & Diagnóstico Inicial',
    description: 'Aplicación para centros de cirugía plástica y medicina estética: presentación confidencial de procedimientos faciales y corporales, agenda de valoración privada y chat directo con asesor médico.',
    features: ['Catálogo confidencial de alta estética', 'Formulario previo de valoración clínica', 'Atención personalizada y discreta', 'Ambiente visual ultra premium'],
    color: '#9333ea',
    accentBg: 'bg-purple-500/10 border-purple-500/30',
    accentText: 'text-purple-400',
    icon: '✨'
  },
  {
    id: 'crm-textil',
    slug: 'crm-textil',
    name: 'Textil Pro CR // Fábrica de Camisetas',
    category: 'taller',
    categoryLabel: 'Producción & Confección',
    badge: 'Taller Textil & Uniformes',
    tagline: 'Cotizador de Prendas, Telas, Bordados & Pizarrón de Taller',
    description: 'Sistema integral para talleres de confección y serigrafía: cotice frente al cliente en 10 segundos según tela, bordados y tallas. Pasa la orden al pizarrón de producción (corte, estampado, costura) y genera proformas listas para WhatsApp.',
    features: ['Cotizador automático por tallas y telas', 'Pizarrón Kanban de taller (5 etapas)', 'Proforma formal en Colones con IVA', 'Control de adelantos 50% y saldos'],
    color: '#6366f1',
    accentBg: 'bg-indigo-500/10 border-indigo-500/30',
    accentText: 'text-indigo-400',
    icon: '👕'
  },
  {
    id: 'menus-asiaticos',
    slug: 'menus-asiaticos',
    name: 'Colección 20 Menús Asiáticos de Autor',
    category: 'gastro',
    categoryLabel: 'Gastronomía & Menús QR',
    badge: '20 Restaurantes de Autor',
    tagline: 'Ramen, Sushi, Wok, Dim Sum & Carta Digital / Impresa HD',
    description: 'Catálogo interactivo con 20 identidades gastronómicas completas (China, Japón, Corea). Incluye carta digital interactiva, selector de autor, modo impresión HD plastificada y optimización móvil sin descargas.',
    features: ['20 restaurantes temáticos listos', 'Modo Carta Digital y Modo Impreso HD', 'Fotografías gastronómicas de alta definición', 'Menú de niños, coctelería y postres'],
    color: '#ef4444',
    accentBg: 'bg-red-500/10 border-red-500/30',
    accentText: 'text-red-400',
    icon: '🥢'
  },
  {
    id: 'menus-mexicanos',
    slug: 'menus-mexicanos',
    name: 'Colección 12 Menús Mexicanos de Autor',
    category: 'gastro',
    categoryLabel: 'Gastronomía & Menús QR',
    badge: '12 Conceptos con Paletas Únicas',
    tagline: 'Taquería, Mole Oaxaca, Cantina, Marisquería & Cortes',
    description: 'Colección de 12 conceptos gastronómicos mexicanos con paletas de color, tipografía e identidades 100% independientes. Vista interactiva en vivo, filtros por especialidad y modo flyer/menú físico.',
    features: ['12 identidades visuales exclusivas', 'Paletas temáticas (Barro, Cobre, Talavera)', 'Visualizador interactivo móvil y escritorio', 'Exportación a formato impreso/PDF'],
    color: '#f59e0b',
    accentBg: 'bg-amber-500/10 border-amber-500/30',
    accentText: 'text-amber-400',
    icon: '🌮'
  },
  {
    id: 'plataforma-menus',
    slug: 'plataforma-menus',
    name: 'GastroSaaS // Plataforma de Menús & Pedidos',
    category: 'gastro',
    categoryLabel: 'SaaS & Gastronomía',
    badge: 'Plataforma Económica desde $15/mes',
    tagline: 'Menú QR, Google My Business, Pedidos a WhatsApp & Cocina KDS',
    description: 'Plataforma completa y económica para restaurantes: Menú QR ultrarrápido conectado a Google Maps, recepción de pedidos a WhatsApp sin comisiones abusivas y pantalla KDS de cocina para el dueño.',
    features: ['Planes accesibles desde $15/mes', 'Conexión a Google My Business y Maps', 'Pedidos directos a WhatsApp (0% comisiones)', 'Calculadora de ROI y pantalla de cocina'],
    color: '#10b981',
    accentBg: 'bg-emerald-500/10 border-emerald-500/30',
    accentText: 'text-emerald-400',
    icon: '📱'
  },
  {
    id: 'crm-muebles',
    slug: 'crm-muebles',
    name: 'Cocinas & Muebles Modernos CR',
    category: 'taller',
    categoryLabel: 'Carpintería & Mueblería',
    badge: 'Carpintería a Medida',
    tagline: 'Cotizador por Metro Lineal, Sobres de Cuarzo & Control de Obras',
    description: 'Control total para mueblerías y talleres de carpintería: cotice en sitio por metro lineal según melamina hidrófuga, herrajes Blum y sobres de granito o cuarzo. Seguimiento de fabricación desde el despiece hasta la instalación en casa.',
    features: ['Cotizador por metro lineal de cocina', 'Seguimiento de obra (corte a instalación)', 'Control de adelanto 50% para materiales', 'Presupuesto formal en colones en letras'],
    color: '#d97706',
    accentBg: 'bg-amber-500/10 border-amber-500/30',
    accentText: 'text-amber-400',
    icon: '🪚'
  }
];

export const SoftwarePage: React.FC<SoftwarePageProps> = ({
  onReturnToPortal,
  lang = 'es',
  onToggleLang
}) => {
  // Guarantee silence on Software Page (User request: quitale la musica a la pagina de software)
  useEffect(() => {
    airlockAudio.stopMusic();
  }, []);

  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'mobile' | 'automation' | 'crm'>('all');
  const [activeDemoTab, setActiveDemoTab] = useState<'citas' | 'menu' | 'roi'>('citas');
  
  // Mobile Menu & Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Showcase State
  const [selectedApp, setSelectedApp] = useState<DemoApp>(DEMO_APPS[0]);

  const handlePrevApp = () => {
    if (!fullScreenApp) return;
    const currentIndex = DEMO_APPS.findIndex(a => a.id === fullScreenApp.id);
    const prevIndex = (currentIndex - 1 + DEMO_APPS.length) % DEMO_APPS.length;
    setFullScreenApp(DEMO_APPS[prevIndex]);
    setSelectedApp(DEMO_APPS[prevIndex]);
  };

  const handleNextApp = () => {
    if (!fullScreenApp) return;
    const currentIndex = DEMO_APPS.findIndex(a => a.id === fullScreenApp.id);
    const nextIndex = (currentIndex + 1) % DEMO_APPS.length;
    setFullScreenApp(DEMO_APPS[nextIndex]);
    setSelectedApp(DEMO_APPS[nextIndex]);
  };
  const [appFilter, setAppFilter] = useState<'all' | 'fitness' | 'gastro' | 'health' | 'taller' | 'auto' | 'travel' | 'beauty'>('all');
  const [fullScreenApp, setFullScreenApp] = useState<DemoApp | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);
  
  // Demo 1: Citas Simulator State
  const [clientName, setClientName] = useState('Mariana Solís');
  const [selectedService, setSelectedService] = useState('Consulta Especializada');
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [demoAppointmentSent, setDemoAppointmentSent] = useState(false);

  // Demo 2: Menu / GastroWeb Simulator State
  const [menuCart, setMenuCart] = useState<{ [key: string]: number }>({
    'Café Especialidad Tarrazú': 1,
    'Tostón con Queso Turrialba': 2
  });
  const [orderSentToKitchen, setOrderSentToKitchen] = useState(false);

  // Demo 3: ROI Calculator State
  const [monthlyClients, setMonthlyClients] = useState(80);
  const [avgTicket, setAvgTicket] = useState(35);
  const [lostAppointments, setLostAppointments] = useState(8);
  const [pricingTier, setPricingTier] = useState<'1m' | '3m' | '6m' | '12m'>('12m');
  const basePlanCost = pricingTier === '1m' ? 300 : pricingTier === '3m' ? 280 : pricingTier === '6m' ? 250 : 199;

  const lostRevenueRecovered = Math.round(lostAppointments * 0.75 * avgTicket);
  const timeSavedHours = 28;
  const timeSavedValue = Math.round(timeSavedHours * 12);
  const totalValueGenerated = lostRevenueRecovered + timeSavedValue;
  const netMonthlyBenefit = totalValueGenerated - basePlanCost;
  const roiPercentage = Math.round((netMonthlyBenefit / basePlanCost) * 100);

  const handleBookAppointment = () => {
    setDemoAppointmentSent(true);
    setTimeout(() => setDemoAppointmentSent(false), 4000);
  };

  const handleSendOrder = () => {
    setOrderSentToKitchen(true);
    setTimeout(() => setOrderSentToKitchen(false), 3500);
  };

  const whatsappBaseUrl = 'https://wa.me/50670693708';
  const getWhatsAppLink = (customMsg: string) => {
    return `${whatsappBaseUrl}?text=${encodeURIComponent(customMsg)}`;
  };

  const filteredApps = appFilter === 'all' 
    ? DEMO_APPS 
    : DEMO_APPS.filter(app => app.category === appFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Microsoft Style) */}
      <div className="bg-[#002050] text-white text-xs py-2.5 px-4 border-b border-blue-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide text-blue-200">DIVISIÓN DIGITAL APCR</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 hidden sm:inline">Ingeniería de Software & Apps Móviles para PYMES y Empresas en Crecimiento</span>
            <span className="text-slate-200 sm:hidden">Software & Apps para PYMES</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-400/30 text-emerald-300 font-mono font-medium">
              PLANES DESDE $199/MES EN ADELANTE
            </span>
            {onToggleLang && (
              <button
                onClick={() => onToggleLang(lang === 'es' ? 'en' : 'es')}
                className="text-blue-200 hover:text-white flex items-center gap-1 transition-colors text-xs cursor-pointer font-medium px-2 py-0.5 rounded border border-blue-700/50 hover:border-blue-500"
                title="Cambiar idioma"
              >
                <Globe className="w-3.5 h-3.5 text-blue-300" />
                <span>{lang.toUpperCase()}</span>
              </button>
            )}
            <button 
              onClick={onReturnToPortal}
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors text-xs cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Volver al Portal' : 'Return to Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CORPORATE HEADER (Inspirado en Microsoft Costa Rica) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo: 4-color grid logo with AP in white */}
          <div className="flex items-center gap-3">
            <a 
              href="#inicio" 
              className="flex items-center gap-3 group focus:outline-none"
            >
              <img 
                src="/logo_tests/cuadricula_v1_ap_centrado.png" 
                alt="Logo APCR Software 4 Colores" 
                className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform drop-shadow-sm" 
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">APCR</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200">
                    SOFTWARE
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5">
                  Soluciones Digitales & Cloud
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a href="#demos-en-vivo" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Apps en Vivo (9 Demos)
            </a>
            <a href="#soluciones" className="hover:text-blue-600 transition-colors">
              Soluciones PYME
            </a>
            <a href="#stack" className="hover:text-blue-600 transition-colors">
              Stack Tecnológico
            </a>
            <a href="#modelo-inversion" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <span>Planes (Desde $199/mes)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">
              Simulador ROI
            </a>
            <a href="#metodologia" className="hover:text-blue-600 transition-colors">
              Metodología
            </a>
          </nav>

          {/* Right Action: Official WhatsApp CTA + Mobile Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={getWhatsAppLink('Hola equipo APCR, deseo cotizar el desarrollo de software o app móvil para mi empresa (Planes desde $199/mes en adelante).')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Hablar con un Ingeniero</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Abrir Menú Móvil"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-800" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Down Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 text-white border-t border-b border-slate-700 px-4 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧭</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Menú de Secciones
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>

            <nav className="space-y-2">
              <a
                href="#demos-en-vivo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-blue-600/25 border border-blue-500/50 text-white font-bold text-sm active:bg-blue-600/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <div className="font-extrabold text-blue-300">Demos de Apps en Vivo (14)</div>
                    <div className="text-[11px] text-slate-300 font-normal">Pruébalas en tu celular en 1 toque</div>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">Probar</span>
              </a>

              <a
                href="#seccion-restaurantes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 hover:bg-amber-500/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍽️</span>
                  <div>
                    <div className="font-extrabold text-amber-300">Menús Restaurantes ($15/m)</div>
                    <div className="text-[11px] text-slate-300 font-normal">Catálogo de 30+ menús QR y pedidos</div>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">Económico</span>
              </a>

              <a
                href="#seccion-crm-explicado"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔨</span>
                  <div>
                    <div className="font-extrabold text-indigo-300">CRM Taller a lo Tico</div>
                    <div className="text-[11px] text-slate-300 font-normal">Cotizaciones, Kanban y pedidos</div>
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">Talleres</span>
              </a>

              <a
                href="#soluciones"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-slate-200 text-sm active:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span>💡</span>
                  <span>Soluciones para Empresas</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="#stack"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-slate-200 text-sm active:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span>⚡</span>
                  <span>Tecnología & Calidad</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="#modelo-inversion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-emerald-400 font-semibold text-sm active:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span>🏷️</span>
                  <span>Planes (Desde $199/mes)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-slate-200 text-sm active:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span>🧮</span>
                  <span>Simulador ROI & Laboratorio</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReturnToPortal();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Portal APCR / Alfombras</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (Microsoft Enterprise Cleanliness) */}
      <section id="inicio" className="relative pt-12 pb-16 lg:pt-18 lg:pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/40">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Ingeniería de Software & Apps para Pequeñas y Medianas Empresas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              Sistemas digitales con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">rigor de ingeniería</span>.
              <br />
              <span className="text-slate-800 font-bold text-3xl sm:text-4xl lg:text-5xl">
                Accesible para tu negocio desde $199/mes en adelante.
              </span>
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8">
              No nos enredamos con corporaciones lentas ni burocracias de 2 años. Desarrollamos, desplegamos y mantenemos el software y las apps móviles que tu empresa necesita para captar clientes, automatizar WhatsApp, agendar citas y controlar operaciones con alta disponibilidad y soporte continuo.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <a
                href="#demos-en-vivo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Probar Demos de Apps en Vivo</span>
              </a>
              <a
                href={getWhatsAppLink('Hola APCR, me gustaría una evaluación técnica para mi empresa y conocer las opciones desde $150 en adelante.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Diagnóstico Técnico Inmediato</span>
              </a>
            </div>

            {/* Trust & Engineering Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 mb-14">
              <div>
                <div className="font-extrabold text-2xl text-slate-900 font-mono">99.9% Uptime</div>
                <div className="text-xs text-slate-500 font-medium">Cloud AWS & Edge CDN</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl text-blue-600 font-mono">&lt; 40ms</div>
                <div className="text-xs text-slate-500 font-medium">Latencia en Costa Rica</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl text-emerald-600 font-mono">5-10 Días</div>
                <div className="text-xs text-slate-500 font-medium">Despliegue a Producción</div>
              </div>
              <div>
                <div className="font-extrabold text-2xl text-purple-600 font-mono">Desde $199/m</div>
                <div className="text-xs text-slate-500 font-medium">Planes de 1 a 12 Meses</div>
                <div className="text-xs text-slate-500 font-medium">En adelante según escala</div>
              </div>
            </div>

          </div>

          {/* 4 PROMINENT SHOWCASE CARDS (USER DIRECT REQUEST: MAS GRANDES CON IMAGEN EN CADA CUADRO) */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                  SOLUCIONES PRINCIPALES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Ingeniería aplicada a las áreas críticas de tu empresa
                </h2>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Toca cualquier solución para ver detalles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* CARD 1: WEBSITES & PWAS */}
              <div className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
                {/* Image Container with 3D illustration */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img 
                    src="/cards/quick_card_websites.png" 
                    alt="Websites & PWAs de Alto Rendimiento"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-600/90 text-white rounded-md backdrop-blur-sm border border-blue-400/30">
                    ALTA CONVERSIÓN
                  </span>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30">
                    100/100 SPEED
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        Websites & PWAs
                      </h3>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Plataformas web ultrarrápidas (&lt;0.8s) optimizadas para Google y diseñadas para convertir visitas en chats directos de WhatsApp.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Next.js 14 + Servidores AWS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>SEO Local para Costa Rica</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Dominio y SSL incluidos</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#producto-web"
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-blue-200 group-hover:border-blue-600"
                  >
                    <span>Ver Plataformas Web</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* CARD 2: CITAS & RESERVAS WHATSAPP */}
              <div className="group rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
                {/* Image Container with 3D illustration */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img 
                    src="/cards/quick_card_citas.png" 
                    alt="Sistema de Citas y Reservas por WhatsApp"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-emerald-600/90 text-white rounded-md backdrop-blur-sm border border-emerald-400/30">
                    AUTOMATIZACIÓN 24/7
                  </span>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30">
                    WHATSAPP BOT
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Citas & Reservas
                      </h3>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Agenda en línea sincronizada con Google Calendar. Envío automático de recordatorios por WhatsApp 24h y 2h antes.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Reduce 80% de inasistencias</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Cero llamadas manuales</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Ideal para clínicas y estéticas</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#demo"
                    onClick={() => setActiveDemoTab('citas')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-emerald-200 group-hover:border-emerald-600"
                  >
                    <span>Probar Simulador de Citas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* CARD 3: APPS MÓVILES */}
              <div className="group rounded-2xl bg-white border border-slate-200 hover:border-purple-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
                {/* Image Container with 3D illustration */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img 
                    src="/cards/quick_card_apps.png" 
                    alt="Apps Móviles para iOS y Android"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-purple-600/90 text-white rounded-md backdrop-blur-sm border border-purple-400/30">
                    MULTIPLATAFORMA
                  </span>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-purple-300 font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-purple-500/30">
                    8 DEMOS EN VIVO
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                        Apps Móviles
                      </h3>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Aplicaciones para iOS y Android con notificaciones push, modo sin conexión, carné digital y catálogos interactivos.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Rendimiento fluido a 60 FPS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Icono directo en celular</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Gimnasios, restaurantes, salud</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#demos-en-vivo"
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-purple-200 group-hover:border-purple-600"
                  >
                    <span>Probar Apps en Celular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* CARD 4: CRM & CONTROL */}
              <div className="group rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
                {/* Image Container with 3D illustration */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img 
                    src="/cards/quick_card_crm.png" 
                    alt="CRM y Control de Operaciones y Taller"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-orange-600/90 text-white rounded-md backdrop-blur-sm border border-orange-400/30">
                    OPERACIÓN & CONTROL
                  </span>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-orange-300 font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-orange-500/30">
                    POSTGRESQL CLOUD
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                        CRM & Control
                      </h3>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      Control total de órdenes de taller, reparaciones o pedidos industriales en la nube con alertas automáticas de WhatsApp al cliente.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Tablero Kanban en tiempo real</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Aviso "Tu pedido está listo"</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Historial de clientes y cobros</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#producto-crm"
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-orange-200 group-hover:border-orange-600"
                  >
                    <span>Conocer Sistema CRM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 4. LIVE APPS SHOWCASE & MOBILE PHONE SIMULATOR (USER'S DIRECT REQUEST) */}
      <section id="demos-en-vivo" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header of Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Demos 100% Reales & Interactivos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Prueba nuestras apps funcionando en tiempo real
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              No son imágenes estáticas ni maquetas de Figma. Son aplicaciones web progresivas (PWAs) y sistemas en producción. Pruébalos en tu celular o en nuestro simulador interactivo.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'all', label: `Todos (${DEMO_APPS.length} Demos)` },
                { id: 'beauty', label: '💅 Salón de Belleza (App)' },
                { id: 'travel', label: '✈️ Agencia de Viajes (App)' },
                { id: 'auto', label: '🏎️ Automotriz & Taller (App)' },
                { id: 'gastro', label: '🍽️ Gastronomía & Menús (7)' },
                { id: 'taller', label: '🔨 Fabricación & CRM' },
                { id: 'fitness', label: '🏋️ Fitness & Deporte' },
                { id: 'health', label: '🦷 Salud & Estética' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setAppFilter(f.id as any)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    appFilter === f.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* MOBILE VIEW (Direct Interactive Cards with 1-Tap Fullscreen Launch - "Para Niños") */}
          <div className="lg:hidden space-y-4">
            {/* Child-Friendly Hint Banner */}
            <div className="bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-blue-400/40 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🎮</div>
              <div className="font-extrabold text-white text-base">¡Pruébalas en tu celular con 1 toque!</div>
              <p className="text-slate-300 text-xs mt-1 leading-snug">
                Toca cualquier recuadro o botón azul para probar la app en vivo. Dentro podrás cambiar de app usando los botones ◀ Anterior y Siguiente ▶.
              </p>
            </div>

            {filteredApps.map((app) => (
              <div 
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setFullScreenApp(app);
                }}
                className="bg-slate-850 rounded-2xl p-5 border border-slate-700 hover:border-blue-500/70 shadow-2xl flex flex-col gap-3.5 cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                {/* Visual Accent Top Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-slate-900 border border-slate-700 shadow-md group-hover:scale-105 transition-transform shrink-0">
                      {app.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-white text-base leading-tight">{app.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${app.accentBg} ${app.accentText}`}>
                          {app.badge}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          En Vivo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  {app.tagline}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  {app.features.slice(0, 4).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Big Button - Easy for everyone */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApp(app);
                      setFullScreenApp(app);
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 active:scale-98 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>TOCAR PARA PROBAR APP</span>
                  </button>

                  <a
                    href={getWhatsAppLink(`Hola APCR, me encantó el demo de "${app.name}" y deseo cotizar un sistema similar para mi negocio (Planes desde $199/mes en adelante).`)}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md active:scale-95"
                    title="Cotizar por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (Interactive Smartphone Mockup & App Selector) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: App List (col-span-7) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Selecciona una app para previsualizar</span>
                <span className="text-blue-400 font-mono">Mostrando {filteredApps.length} de {DEMO_APPS.length} apps</span>
              </div>

              <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredApps.map((app) => {
                  const isSelected = selectedApp.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => {
                        setSelectedApp(app);
                        setIframeKey(prev => prev + 1);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                          : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-900 border border-slate-700 shrink-0">
                          {app.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{app.name}</h3>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${app.accentBg} ${app.accentText}`}>
                              {app.badge}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                            {app.tagline}
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-400">
                            {app.features.slice(0, 2).map((f, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                <span>{f}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {isSelected ? 'Activo en Simulador' : 'Ver Demo'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                            setFullScreenApp(app);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Abrir en pantalla completa"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Expandir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Realistic Smartphone Frame (col-span-5) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Smartphone Frame Header Actions */}
              <div className="w-[375px] mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono font-medium text-white">{selectedApp.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIframeKey(k => k + 1)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Recargar app"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setFullScreenApp(selectedApp)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Pantalla Completa</span>
                  </button>
                </div>
              </div>

              {/* iPhone Mockup Frame */}
              <div className="relative w-[375px] h-[680px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-white/10 flex flex-col">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>

                {/* Screen Bezel & Screen Container */}
                <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden flex flex-col">
                  
                  {/* Status Bar simulation */}
                  <div className="h-9 w-full bg-slate-950/80 backdrop-blur text-white text-[10px] flex items-center justify-between px-6 z-10 select-none">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center gap-1 text-[9px]">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Interactive App iFrame */}
                  <div className="flex-1 w-full relative bg-slate-900">
                    <iframe
                      key={iframeKey}
                      src={`/demos/${selectedApp.slug}/index.html`}
                      title={selectedApp.name}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>

                  {/* Home indicator bar */}
                  <div className="h-5 w-full bg-slate-950 flex items-center justify-center">
                    <div className="w-28 h-1 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Bar below mockup */}
              <div className="mt-4 w-[375px] flex items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-300">¿Te interesa este sistema?</span>
                <a
                  href={getWhatsAppLink(`Hola APCR, me interesa implementar la app de "${selectedApp.name}" para mi negocio (Planes desde $199/mes en adelante).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Cotizar desde $199/mes</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FULLSCREEN APP MODAL (FOR MOBILE & EXPANDED DESKTOP VIEW - CHILD FRIENDLY) */}
      {fullScreenApp && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
          
          {/* Top Control Bar */}
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Big, Clear Red Close Button (Child-Friendly, no confusion) */}
              <button
                onClick={() => setFullScreenApp(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-extrabold shadow-md cursor-pointer transition-all active:scale-95"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>CERRAR</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg">{fullScreenApp.icon}</span>
                <span className="font-extrabold text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-none">{fullScreenApp.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppLink(`Hola APCR, estoy probando el demo completo de "${fullScreenApp.name}" y deseo una app para mi empresa (Planes desde $199/mes en adelante).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Quiero esta App</span>
                <span className="sm:hidden">Cotizar</span>
              </a>
            </div>
          </div>

          {/* Full viewport iframe */}
          <div className="flex-1 w-full relative bg-slate-950 overflow-hidden">
            <iframe
              key={fullScreenApp.id}
              src={`/demos/${fullScreenApp.slug}/index.html`}
              title={fullScreenApp.name}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>

          {/* Bottom Floating Navigation Switcher (Browse all 9 apps effortlessly with 1 tap) */}
          <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 z-30">
            <button
              onClick={handlePrevApp}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                App {DEMO_APPS.findIndex(a => a.id === fullScreenApp.id) + 1} de {DEMO_APPS.length}
              </span>
              <span className="text-xs font-extrabold text-blue-400 truncate max-w-[150px] sm:max-w-[280px]">
                {fullScreenApp.name}
              </span>
            </div>

            <button
              onClick={handleNextApp}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. PRICING & INVERSION MODEL SECTION (DESDE $150 EN ADELANTE) */}
      <section id="modelo-inversion" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-4">
              OPCIONES DE COBRO TRANSPARENTES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Planes de Cobro para Apps y Sistemas
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Elige el plazo que mejor se adapte al flujo de tu negocio. Sin costos ocultos, con mantenimiento, servidor y soporte directo por ingenieros.
            </p>
          </div>

          {/* 4 PRICING CARDS GRID (1 Mes, 3 Meses, 6 Meses, 12 Meses) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* TIER 1: 1 MES */}
            <div 
              onClick={() => setPricingTier('1m')}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative ${
                pricingTier === '1m'
                  ? 'bg-slate-800/90 border-blue-500 shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">PLAN MENSUAL</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">1 MES</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Flexibilidad Total</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ideal para validar tu app o sistema sin compromisos de permanencia.</p>

                <div className="mt-5 pb-5 border-b border-slate-700/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">$300</span>
                    <span className="text-slate-400 text-xs">USD / mes</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Facturado mes a mes (~₡156,000 colones)
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tu App o Sistema 100% Operativo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Alojamiento Cloud & SSL incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Soporte técnico y ajustes continuos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Renueva o cancela mes a mes</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan de 1 Mes ($300/mes) para mi app/sistema y coordinar el desarrollo.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    pricingTier === '1m'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Elegir 1 Mes ($300)</span>
                </a>
              </div>
            </div>

            {/* TIER 2: 3 MESES */}
            <div 
              onClick={() => setPricingTier('3m')}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative ${
                pricingTier === '3m'
                  ? 'bg-slate-800/90 border-blue-500 shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">TRIMESTRAL</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">3 MESES</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Consolidación</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Para negocios que buscan lanzar y madurar su canal digital con ahorro.</p>

                <div className="mt-5 pb-5 border-b border-slate-700/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">$280</span>
                    <span className="text-slate-400 text-xs">USD / mes</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-1">
                    Ahorras $60 ($840 total trimestral)
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Todo lo del plan mensual</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Prioridad en mejoras y cambios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Capacitación a tu equipo de trabajo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ahorro de $20 cada mes</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan Trimestral de 3 Meses ($280/mes) para mi app/sistema.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    pricingTier === '3m'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Elegir 3 Meses ($280)</span>
                </a>
              </div>
            </div>

            {/* TIER 3: 6 MESES */}
            <div 
              onClick={() => setPricingTier('6m')}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative ${
                pricingTier === '6m'
                  ? 'bg-slate-800/90 border-emerald-500 shadow-2xl ring-2 ring-emerald-500/50 scale-[1.02]'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">SEMESTRAL</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">6 MESES</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Crecimiento</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Excelente balance entre ahorro significativo y soporte continuo asegurado.</p>

                <div className="mt-5 pb-5 border-b border-slate-700/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">$250</span>
                    <span className="text-slate-400 text-xs">USD / mes</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-1">
                    Ahorras $300 ($1,500 total semestral)
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Todo lo del plan trimestral</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Optimización de velocidad y SEO continuo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Backups diarios y monitoreo 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ahorro de $50 cada mes</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan Semestral de 6 Meses ($250/mes) para mi app/sistema.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    pricingTier === '6m'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Elegir 6 Meses ($250)</span>
                </a>
              </div>
            </div>

            {/* TIER 4: 12 MESES (ANUAL) - LA MÁS BARATA & RECOMENDADA */}
            <div 
              onClick={() => setPricingTier('12m')}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative ${
                pricingTier === '12m'
                  ? 'bg-gradient-to-b from-blue-950/90 via-slate-850 to-slate-900 border-emerald-400 shadow-2xl ring-2 ring-emerald-400/80 scale-[1.04]'
                  : 'bg-slate-850/80 border-emerald-500/50 hover:border-emerald-400'
              }`}
            >
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg shadow-emerald-500/40 whitespace-nowrap">
                ★ LA MÁS BARATA & POPULAR ★
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">PLAN ANUAL</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">12 MESES</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Máximo Rendimiento</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">El precio más económico por mes para tener tu departamento de tecnología todo el año.</p>

                <div className="mt-5 pb-5 border-b border-slate-700/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">$199</span>
                    <span className="text-slate-400 text-xs">USD / mes</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-semibold mt-1">
                    ¡Ahorras $1,212 al año! (~₡103,000 colones/mes)
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">Tarifa mensual más baja ($199)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dominio corporativo .com o .cr incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Soporte VIP prioritario 365 días</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Actualizaciones continuas y mejoras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Backups diarios automatizados</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan Anual de 12 Meses ($199/mes - La opción más económica) para la app/sistema de mi empresa.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Elegir 12 Meses ($199/m)</span>
                </a>
              </div>
            </div>

          </div>

          {/* Guarantee & Payment details footer banner */}
          <div className="max-w-4xl mx-auto bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Implementación Ágil en 5 a 10 Días</span>
                <span>Tu app entra en producción rápida sin demoras burocráticas. Pagos por SINPE Móvil o Transferencia.</span>
              </div>
            </div>
            <a
              href={getWhatsAppLink('Hola APCR, tengo dudas sobre los planes de 1, 3, 6 y 12 meses y me gustaría hablar con un ingeniero.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold whitespace-nowrap transition-colors"
            >
              Consultar con un Ingeniero
            </a>
          </div>

        </div>
      </section>

      {/* 6. SOLUTIONS CATALOG (Clean Microsoft Cards) */}
      <section id="soluciones" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
              CATÁLOGO DE INGENIERÍA DE SOFTWARE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Soluciones probadas que generan dinero todos los días
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Sistemas modulares diseñados para ejecutarse rápido, sin fallar y sin necesidad de que tú seas un experto en tecnología.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { id: 'all', label: 'Todos (6)' },
                { id: 'web', label: 'Websites & Portales' },
                { id: 'automation', label: 'Citas & Menús QR' },
                { id: 'crm', label: 'CRM & Taller' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveCategory(filter.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    activeCategory === filter.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Product 1 */}
            <div id="producto-web" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                    ALTA CONVERSIÓN
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Websites & Plataformas Web de Alto Rendimiento
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Sitios web corporativos que cargan en menos de 0.8 segundos con 100/100 en Google PageSpeed. Diseñados para que un visitante se convierta en un mensaje directo a tu WhatsApp.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Stack:</span>
                    <span>Next.js 14, React, Tailwind CSS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Hosting:</span>
                    <span>Edge Network Cloudflare / Vercel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">SEO:</span>
                    <span>Optimizado para Google Costa Rica</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Desde $199/mes en adelante</span>
                <a 
                  href={getWhatsAppLink('Hola APCR, deseo cotizar un sitio web corporativo de alta velocidad (Planes desde $199/mes en adelante).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Product 2 */}
            <div id="producto-citas" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    TOP RENTABILIDAD
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Sistema de Citas & Recordatorios WhatsApp
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Plataforma web donde tus clientes eligen servicio, día y hora. El sistema envía recordatorios automáticos por WhatsApp 24h y 2h antes, reduciendo las citas perdidas en un 80%.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Ideal para:</span>
                    <span>Clínicas, estéticas, spas, barberías</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">WhatsApp:</span>
                    <span>Recordatorios automáticos sin tocar el celular</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Calendario:</span>
                    <span>Sincronización en vivo con Google Calendar</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Desde $199/mes en adelante</span>
                <a 
                  href={getWhatsAppLink('Hola APCR, deseo cotizar el sistema de citas y recordatorios por WhatsApp (Planes desde $199/mes en adelante).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Product 3 */}
            <div id="producto-menu" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                    0% COMISIÓN DELIVERY
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  Menú Digital QR & GastroWeb en Tiempo Real
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Menú interactivo ultra-rápido para restaurantes, sodas y cafeterías. Los comensales escanean con su cámara, eligen platos y la orden llega directa al WhatsApp o a la pantalla de cocina.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Tecnología:</span>
                    <span>PWA Instantánea (sin descargar apps)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Ahorro:</span>
                    <span>Sin comisiones de 30% a apps intermediarias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Precios:</span>
                    <span>Cambia platos y precios en 5 segundos</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Desde $199/mes en adelante</span>
                <a 
                  href={getWhatsAppLink('Hola APCR, deseo cotizar el menú digital QR con pedidos a WhatsApp para mi restaurante/soda (Planes desde $199/mes en adelante).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Product 4 */}
            <div id="producto-crm" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    OPERACIÓN & CONTROL
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  CRM Personalizado & Control de Taller / Pedidos
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Adiós a los cuadernos y hojas de Excel enredadas. Un software donde registras el estado de cada vehículo, reparación o pedido industrial, notificando al cliente por WhatsApp en cada fase.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Módulos:</span>
                    <span>Clientes, Órdenes, Estados, Inventario básico</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Alertas:</span>
                    <span>WhatsApp automático "Tu pedido está listo"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Acceso:</span>
                    <span>100% en la nube desde celular o PC</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">1m $300 · 3m $280 · 6m $250 · 12m $199</span>
                  <a 
                    href="#seccion-crm-explicado"
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Ver Explicación & Demos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      const app = DEMO_APPS.find(a => a.id === 'crm-textil');
                      if (app) {
                        setSelectedApp(app);
                        setFullScreenApp(app);
                      }
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>👕 Demo Camisetas</span>
                  </button>
                  <button
                    onClick={() => {
                      const app = DEMO_APPS.find(a => a.id === 'crm-muebles');
                      if (app) {
                        setSelectedApp(app);
                        setFullScreenApp(app);
                      }
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white font-bold text-[11px] text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🪚 Demo Mueblería</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product 5 */}
            <div id="producto-apps" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full">
                    MULTIPLATAFORMA
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Apps Móviles para iOS & Android
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Aplicaciones móviles modernas desarrolladas con React Native o Flutter. Notificaciones push al teléfono de tus clientes, fidelización por puntos y catálogo offline sin costo de servidores gigantes.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Framework:</span>
                    <span>React Native / Flutter / PWA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Notificaciones:</span>
                    <span>Push directas a la pantalla de bloqueo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Tiendas:</span>
                    <span>App Store de Apple y Google Play</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Desde $199/mes en adelante</span>
                <a 
                  href={getWhatsAppLink('Hola APCR, deseo cotizar una App Móvil para iOS y Android (Planes desde $199/mes en adelante).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Product 6 */}
            <div id="producto-ia" className="group rounded-2xl p-7 bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full">
                    INTELIGENCIA ARTIFICIAL
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  Chatbots IA & Asistentes de Venta 24/7
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Agentes de IA entrenados con la información de tu empresa, productos y precios. Responden preguntas complejas de tus clientes a las 2 de la mañana y captan el contacto para cerrar la venta en la mañana.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Modelo:</span>
                    <span>OpenAI / Gemini con RAG de tu negocio</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Canales:</span>
                    <span>WhatsApp Business API, Web Chat, Instagram</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">Humano:</span>
                    <span>Traspaso a agente en caliente cuando se requiera</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Desde $199/mes en adelante</span>
                <a 
                  href={getWhatsAppLink('Hola APCR, deseo cotizar un Agente o Chatbot con IA para automatizar atención en WhatsApp (Planes desde $199/mes en adelante).')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Cotizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6.4 SECTION: SOFTWARE MUY ECONÓMICO PARA RESTAURANTES & CATÁLOGO DE MENÚS QR
          Pensado para sodas, cafeterías, taquerías, pizzerías y restaurantes en Costa Rica
          ========================================================================= */}
      <section id="seccion-restaurantes" className="py-16 lg:py-24 bg-gradient-to-b from-slate-950 via-[#111827] to-slate-900 text-white relative overflow-hidden border-t border-slate-800">

        {/* Glow ambient effects */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>SOFTWARE GASTRONÓMICO ACCESIBLE // PLANES DESDE $15/MES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Digitalice su restaurante o soda sin pagar comisiones abusivas
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Muchas aplicaciones de entrega le quitan hasta el <strong>30% de comisión</strong> en cada platillo, y mandar una foto borrosa de la carta o un PDF pesado de 20MB hace que los clientes se cansen y se vayan. Con nuestros menús digitales QR, el cliente abre la carta en <strong>1 segundo</strong>, pide directo a su <strong>WhatsApp</strong> y usted se deja el <strong>100% de la venta</strong>.
            </p>
          </div>

          {/* 4 Critical Pillars for Restaurants in CR */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Carga en 1 Segundo</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                El comensal apunta su celular al código QR en la mesa y entra al menú instantáneamente sin descargar aplicaciones pesadas ni registrarse.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4">
                💬
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pedidos a WhatsApp (0% Comisión)</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                El cliente arma su orden con extras, bebidas y notas. Al tocar un botón, la comanda le llega lista y desglosada a su WhatsApp o para pago por SINPE Móvil.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-4">
                📍
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Google Maps & Local SEO</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Conectamos el enlace oficial a su ficha de Google My Business para que los comensales que buscan comida en su zona lo encuentren primero.
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-red-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mb-4">
                🎨
              </div>
              <h3 className="text-lg font-bold text-white mb-2">+30 Menús de Autor Listos</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                ¿No tiene fotos profesionales ni diseñador? Ya tenemos colecciones temáticas listas con fotos de alta definición para adaptar a su negocio en horas.
              </p>
            </div>
          </div>

          {/* Interactive Demos Grid (Give shape to the menus) */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                CATÁLOGO VIVO EN PRODUCCIÓN
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Pruebe las Colecciones de Menús que Diseñamos
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mt-2">
                Haga clic en cualquiera de las colecciones para probar el menú real en el simulador móvil interactivo o abrirlo en pantalla completa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Demo 1: Menús Asiáticos */}
              <div className="bg-slate-900/95 rounded-2xl p-6 border border-red-500/30 hover:border-red-400/80 shadow-xl flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🥢</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      20 RESTAURANTES
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                    Colección 20 Menús Asiáticos
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    China, Japón y Corea. Ramen, sushi, wok, dim sum y postres con fotografía gastronómica en alta resolución, modo carta virtual y versión para imprimir plastificada.
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-300 mb-6">
                    <li className="flex items-center gap-1.5"><span className="text-red-400">✓</span> 20 Conceptos de Autor independientes</li>
                    <li className="flex items-center gap-1.5"><span className="text-red-400">✓</span> Modo Carta Digital + Modo Impreso HD</li>
                    <li className="flex items-center gap-1.5"><span className="text-red-400">✓</span> Menú de niños, cocteles y postres</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const app = DEMO_APPS.find(a => a.id === 'menus-asiaticos');
                    if (app) { setSelectedApp(app); setFullScreenApp(app); }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Probar Menús Asiáticos</span>
                </button>
              </div>

              {/* Demo 2: Menús Mexicanos */}
              <div className="bg-slate-900/95 rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/80 shadow-xl flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🌮</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      12 CONCEPTOS
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    Colección 12 Menús Mexicanos
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Oaxaca Mole, Taquería de Barrio, Cantina Real, Marisquería Pacífico. Cada restaurante cuenta con paleta de colores propia (Barro, Cobre, Talavera) e identidades únicas.
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-300 mb-6">
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Paletas visuales temáticas únicas</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> 15 fotografías de platos recortadas</li>
                    <li className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> Menú virtual interactivo y flyer</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const app = DEMO_APPS.find(a => a.id === 'menus-mexicanos');
                    if (app) { setSelectedApp(app); setFullScreenApp(app); }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Probar Menús Mexicanos</span>
                </button>
              </div>

              {/* Demo 3: Soda Típica Doña Rosa */}
              <div className="bg-slate-900/95 rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/80 shadow-xl flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🇨🇷</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SODA COSTARRICENSE
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    Doña Rosa Soda Tradicional
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    App ligera para sodas de barrio y comidas típicas: casados con carnes en salsa, olla de carne, desayunos típicos con pinto y batidos naturales, con despacho directo por WhatsApp.
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-300 mb-6">
                    <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Casados del día configurables</li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Envío formateado a WhatsApp</li>
                    <li className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Carga ultrarrápida en cualquier celular</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const app = DEMO_APPS.find(a => a.id === 'soda-rosa');
                    if (app) { setSelectedApp(app); setFullScreenApp(app); }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Probar Soda Doña Rosa</span>
                </button>
              </div>

              {/* Demo 4: Plataforma GastroSaaS */}
              <div className="bg-slate-900/95 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/80 shadow-xl flex flex-col justify-between group transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">📱</span>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      PLATAFORMA SAAS
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    Plataforma GastroSaaS Integral
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    La solución SaaS completa para restaurantes: menú QR con carrito, envío a WhatsApp, ficha en Google Maps, pantalla de cocina KDS y simulador de retorno de inversión.
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-300 mb-6">
                    <li className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> Menú QR + Carrito + Reservas</li>
                    <li className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> Pantalla de Cocina KDS en vivo</li>
                    <li className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> Calculadora de Ahorro de Comisiones</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const app = DEMO_APPS.find(a => a.id === 'plataforma-menus');
                    if (app) { setSelectedApp(app); setFullScreenApp(app); }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Probar GastroSaaS</span>
                </button>
              </div>

            </div>
          </div>

          {/* Pricing Grid: Planes Muy Económicos para Restaurantes (1, 3, 6, 12 meses) */}
          <div className="mb-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                PRECIOS ULTRA ACCESIBLES SIN CONTRATOS FORZOSOS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Planes Diseñados para Sodas, Cafeterías y Restaurantes
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">
                Menos de lo que gasta en una pizza al mes para tener presencia profesional en Google y pedidos sin comisiones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

              {/* Plan Básico */}
              <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-7 border border-slate-700/80 hover:border-slate-500 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    🚀 Lo Mínimo Indispensable
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2">Plan Básico (Menú QR + Google)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 min-h-[36px]">
                    Menú QR ultrarrápido conectado a Google Maps y Google My Business para que los clientes locales lo encuentren.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">$19</span>
                      <span className="text-slate-400 text-xs">/ mes</span>
                      <span className="text-[11px] font-bold text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded">
                        $15/m en anual
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span>• 1 Mes:</span>
                        <span className="font-bold text-white">$19 / mes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 3 Meses:</span>
                        <span className="font-bold text-white">$18 / mes ($54 total)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 6 Meses:</span>
                        <span className="font-bold text-white">$17 / mes ($102 total)</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>• 12 Meses:</span>
                        <span>$15 / mes ($180 total)</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Menú QR interactivo ultra-rápido en móviles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Enlace oficial verificado para Google Maps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Código QR en alta resolución listo para imprimir</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Cambio de platos y precios ilimitados en 5 segundos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Filtros de alérgenos (Vegetariano, Gluten Free)</span>
                    </li>
                  </ul>
                </div>

                <a
                  href={getWhatsAppLink('Hola APCR, me interesa el Plan Básico para Restaurantes ($15 a $19/mes) con Menú QR y Google Maps.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer"
                >
                  <span>Elegir Plan Básico</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Plan Pro (Más Popular) */}
              <div className="bg-gradient-to-b from-slate-900 to-[#1e1b4b] rounded-2xl p-6 sm:p-7 border-2 border-amber-500 shadow-2xl shadow-amber-500/20 relative flex flex-col justify-between scale-[1.02] z-10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  ★ MÁS POPULAR PARA RESTAURANTES
                </div>

                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1 mt-1">
                    ⭐ Pedidos Directos a su WhatsApp
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2">Plan Pro (Menú + WhatsApp + Reservas)</h4>
                  <p className="text-slate-300 text-xs leading-relaxed mb-6 min-h-[36px]">
                    Convierte la carta en una máquina de ventas sin intermediarios con carrito, pedidos directos y reservas de mesa.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400">$39</span>
                      <span className="text-slate-400 text-xs">/ mes</span>
                      <span className="text-[11px] font-bold text-emerald-400 ml-auto bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        $32/m en anual
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span>• 1 Mes:</span>
                        <span className="font-bold text-white">$39 / mes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 3 Meses:</span>
                        <span className="font-bold text-white">$36 / mes ($108 total)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 6 Meses:</span>
                        <span className="font-bold text-white">$34 / mes ($204 total)</span>
                      </div>
                      <div className="flex justify-between text-amber-300 font-bold">
                        <span>• 12 Meses:</span>
                        <span>$32 / mes ($384 total)</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-white">Todo lo incluido en el Plan Básico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Carrito de compras con cálculo automático de totales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-amber-300">Envío directo de la orden al WhatsApp del local</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Modalidad: En Mesa, Para Llevar o Delivery con SINPE</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Formulario de reservas de mesas en línea</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Personalización de platillos (términos, ingredientes extra)</span>
                    </li>
                  </ul>
                </div>

                <a
                  href={getWhatsAppLink('Hola APCR, deseo activar el Plan Pro para Restaurantes ($32 a $39/mes) con pedidos directos a WhatsApp y Carrito.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <span>Elegir Plan Pro (Recomendado)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </a>
              </div>

              {/* Plan Enterprise */}
              <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-7 border border-slate-700/80 hover:border-slate-500 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    👑 Plataforma Completa
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2">Plan Enterprise (Cocina KDS + Admin)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 min-h-[36px]">
                    Sistema integral con pantalla de cocina para despachar comandas y panel administrativo en vivo para el dueño.
                  </p>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">$79</span>
                      <span className="text-slate-400 text-xs">/ mes</span>
                      <span className="text-[11px] font-bold text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded">
                        $65/m en anual
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/80 text-[11px] text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span>• 1 Mes:</span>
                        <span className="font-bold text-white">$79 / mes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 3 Meses:</span>
                        <span className="font-bold text-white">$74 / mes ($222 total)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• 6 Meses:</span>
                        <span className="font-bold text-white">$69 / mes ($414 total)</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>• 12 Meses:</span>
                        <span>$65 / mes ($780 total)</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-white">Todo lo incluido en los Planes Básico y Pro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Pantalla de Cocina en Tiempo Real (KDS) con avisos sonoros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Modo Dueño: marque platos agotados con un solo toque</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Reportes de platos más vendidos y horas pico de pedidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Soporte prioritario y configuración personalizada para su local</span>
                    </li>
                  </ul>
                </div>

                <a
                  href={getWhatsAppLink('Hola APCR, deseo cotizar el Plan Enterprise para Restaurantes ($65 a $79/mes) con Pantalla KDS de Cocina y Panel Admin.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-600 transition-all cursor-pointer"
                >
                  <span>Elegir Plan Enterprise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

          {/* WhatsApp Direct Help Banner */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-emerald-400 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                <span>🇨🇷 Soporte y Configuración en Costa Rica</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                ¿Tiene un menú físico en papel o fotos y quiere digitalizarlo ya?
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm">
                Envíenos fotos de su menú actual por WhatsApp al <strong>+506 7069-3708</strong> y nosotros le armamos su demo personalizado sin costo.
              </p>
            </div>
            <a
              href={getWhatsAppLink('Hola APCR, tengo mi menú actual y deseo que me ayuden a digitalizarlo con código QR y pedidos a WhatsApp.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Enviar mi Menú por WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6.5 SECTION: CRM & CONTROL DE TALLER "A LO TICO" (EXPLICACIÓN CLARA & DEMOS)
          Diseñado para que cualquier dueño de taller, carpintería o fábrica lo entienda
          ========================================================================= */}
      <section id="seccion-crm-explicado" className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 via-[#0a1128] to-slate-950 text-white relative overflow-hidden border-t border-slate-800">
        
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>SISTEMAS PARA NEGOCIOS REALES DE COSTA RICA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              ¿Qué es un CRM y por qué su taller o fábrica lo necesita?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Muchos dueños de negocio en el país no son técnicos en computación y nunca han usado un "CRM". Aquí se lo explicamos sin rodeos ni palabras raras: es su <strong>Secretario Digital y Gerente de Taller en el Celular</strong> las 24 horas del día.
            </p>
          </div>

          {/* Comparativa: Antes vs Con el Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Columna 1: El Dolor de Cabeza Tradicional */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-red-900/40 text-red-400 flex items-center justify-center font-bold text-lg">
                  ❌
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Como trabajan muchos talleres hoy en día:</h3>
                  <span className="text-xs text-red-400 font-mono">Pérdida de tiempo, clientes enojados y plata en el aire</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-red-900/30">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Cotizaciones perdidas en WhatsApp:</strong> El cliente pide precio de 30 camisetas o un mueble de cocina, y a los 3 días el chat se hundió entre 200 mensajes más y se perdió la venta.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-red-900/30">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Desorden en el taller:</strong> El cliente llama a preguntar <em>"¿cómo va mi trabajo?"</em> y hay que ponerlo a esperar mientras se va al taller a preguntarle al operario si ya se cortó o se armó.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-red-900/30">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Cálculos a mano en papelitos:</strong> Errores cobrando menos de lo que costó el material o calculando mal el IVA y el transporte.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-red-900/30">
                  <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Plata en la calle sin cobrar:</strong> Entregaron el producto y nadie apuntó si pagaron el 50% de saldo o si quedó debiendo.</p>
                </div>
              </div>
            </div>

            {/* Columna 2: La Solución con su Sistema Personalizado */}
            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-emerald-600 text-white font-mono text-[11px] font-bold">
                CONTROL TOTAL DESDE EL CELULAR
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-900/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  ✅
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Con su Sistema Personalizado APCR:</h3>
                  <span className="text-xs text-emerald-400 font-mono">Tranquilidad, rapidez y cuentas claras al centavo</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Cotizador Rápido en 10 Segundos:</strong> Usted o sus vendedores ingresan las medidas o cantidades desde el celular y el sistema genera la proforma formal con desglose de IVA y monto en letras para enviarla directo a WhatsApp.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Pizarrón Digital del Taller (Kanban):</strong> Todo su equipo ve qué trabajos están en diseño, cuáles en corte, cuáles en costura/armado y cuáles listos para entrega. Cero gritos en el taller.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Control de Anticipos y Saldos:</strong> El sistema registra el 50% de adelanto para compra de insumos y le avisa cuánto tiene pendiente de cobrar al entregar.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-900/30">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                  <p><strong>Historial Completo de Clientes:</strong> Con un solo toque ve todo lo que ese cliente le ha comprado en los últimos años, con teléfonos y facturas.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Demos Interactivos en Vivo */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-16">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">PRUÉBELO USTED MISMO EN VIVO</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Demos reales configurados para talleres costarricenses
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Haga clic en cualquiera de los dos demos para probar el cotizador automático en Colones y mover los pedidos en el tablero del taller en tiempo real:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DEMO 1: TEXTIL */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-indigo-500/40 hover:border-indigo-400 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl">
                      👕
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono text-[10px] font-bold uppercase">
                      CONFECCIÓN & UNIFORMES
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    Fábrica de Camisetas & Uniformes (Textil Pro CR)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Cotizador de camisetas Polo, Dry-Fit, algodón, bordados y serigrafía con desglose por tallas (S, M, L, XL), cálculo de adelanto del 50% y pizarrón de taller de 5 etapas (Corte, Bordado, Costura, Entrega).
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-6">
                    <div>✓ Cotiza por volumen mayorista en segundos</div>
                    <div>✓ Pizarrón interactivo de rollos a empaque</div>
                    <div>✓ Formato listo para enviar a WhatsApp</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      const app = DEMO_APPS.find(a => a.id === 'crm-textil');
                      if (app) {
                        setSelectedApp(app);
                        setFullScreenApp(app);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Probar Demo Camisetas</span>
                  </button>
                  <a
                    href={getWhatsAppLink('Hola APCR, vi el demo de CRM de Fábrica de Camisetas y deseo cotizar uno para mi empresa.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Cotizar</span>
                  </a>
                </div>
              </div>

              {/* DEMO 2: MUEBLERÍA */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-amber-500/40 hover:border-amber-400 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
                      🪚
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-mono text-[10px] font-bold uppercase">
                      CARPINTERÍA & MUEBLERÍA
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
                    Mueblería de Cocina & Carpintería a Medida
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Cotizador por metro lineal de muebles aéreos y bajos, melamina hidrófuga RH 18mm, sobres de cuarzo o granito y herrajes Blum. Seguimiento de fabricación desde la medición hasta la instalación en casa.
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-6">
                    <div>✓ Cotización precisa por metros lineales</div>
                    <div>✓ Control de 50% de materiales y saldo en sitio</div>
                    <div>✓ Pizarrón de obra: Planos, Corte, Enchapado, Casa</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      const app = DEMO_APPS.find(a => a.id === 'crm-muebles');
                      if (app) {
                        setSelectedApp(app);
                        setFullScreenApp(app);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Probar Demo Mueblería</span>
                  </button>
                  <a
                    href={getWhatsAppLink('Hola APCR, vi el demo de CRM de Mueblería y Carpintería y deseo cotizar uno para mi taller.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Cotizar</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* TABLA DE PRECIOS CLARA DE 4 OPCIONES PARA EL CRM */}
          <div className="bg-gradient-to-br from-slate-900 via-[#071329] to-slate-950 border border-blue-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">OPCIONES DE COBRO & PLANES ACCESIBLES</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Planes transparentes para implementar el CRM en su empresa
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Sin cobros sorpresa ni letras pequeñas. Incluye montaje de su logotipo, adaptación del cotizador a sus productos, base de datos en la nube y soporte continuo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* PLAN 1 MES */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">PLAN MENSUAL</div>
                  <div className="text-xl font-bold text-white mb-2">1 Mes</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-white font-mono">$300</span>
                    <span className="text-xs text-slate-400">/ mes</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Total: <strong className="text-white font-mono">$300 USD</strong>. La opción ideal para probar el sistema en su taller sin contratos a largo plazo.
                  </p>
                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                    <div>✓ Cotizador a la medida</div>
                    <div>✓ Pizarrón Kanban de taller</div>
                    <div>✓ Acceso desde celular y PC</div>
                    <div>✓ Renovación mes a mes</div>
                  </div>
                </div>
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan de 1 Mes ($300/mes) para el CRM de mi empresa.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block"
                >
                  Elegir 1 Mes ($300)
                </a>
              </div>

              {/* PLAN 3 MESES */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all">
                <div>
                  <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">TRIMESTRAL</div>
                  <div className="text-xl font-bold text-white mb-2">3 Meses</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-white font-mono">$280</span>
                    <span className="text-xs text-slate-400">/ mes</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Total: <strong className="text-white font-mono">$840 USD</strong>. Ahorra $60 en comparación al pago mensual.
                  </p>
                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                    <div>✓ Todo lo del plan mensual</div>
                    <div>✓ Capacitación para su personal</div>
                    <div>✓ Soporte prioritario</div>
                    <div>✓ Ahorro de $60 garantizado</div>
                  </div>
                </div>
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan de 3 Meses ($280/mes - Total $840) para el CRM de mi empresa.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block"
                >
                  Elegir 3 Meses ($280/m)
                </a>
              </div>

              {/* PLAN 6 MESES */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-600 transition-all">
                <div>
                  <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">SEMESTRAL</div>
                  <div className="text-xl font-bold text-white mb-2">6 Meses</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-black text-white font-mono">$250</span>
                    <span className="text-xs text-slate-400">/ mes</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Total: <strong className="text-white font-mono">$1,500 USD</strong>. Ahorra $300, excelente para consolidar operaciones.
                  </p>
                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
                    <div>✓ Todo lo del plan trimestral</div>
                    <div>✓ Reportes mensuales de ventas</div>
                    <div>✓ Ajustes de fórmulas de cotización</div>
                    <div>✓ Ahorro de $300 garantizado</div>
                  </div>
                </div>
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan Semestral de 6 Meses ($250/mes - Total $1,500) para el CRM de mi empresa.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors block"
                >
                  Elegir 6 Meses ($250/m)
                </a>
              </div>

              {/* PLAN 12 MESES (ANUAL) - ESTRELLA */}
              <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 rounded-2xl p-5 border-2 border-emerald-500 flex flex-col justify-between relative shadow-2xl scale-[1.02]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  ★ LA MÁS BARATA & POPULAR ★
                </div>
                <div>
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1 pt-1">PLAN ANUAL</div>
                  <div className="text-xl font-bold text-white mb-2">12 Meses</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-4xl font-black text-emerald-400 font-mono">$199</span>
                    <span className="text-xs text-slate-300">/ mes</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Total: <strong className="text-white font-mono">$2,388 USD</strong>. ¡Ahorras <span className="text-emerald-400 font-bold">$1,212 al año</span>! La tarifa mensual más baja disponible.
                  </p>
                  <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-slate-800 pt-3">
                    <div>✓ Mantenimiento y hosting cloud 100% incluido</div>
                    <div>✓ Soporte VIP continuo</div>
                    <div>✓ Base de datos ilimitada de clientes</div>
                    <div>✓ La opción de mayor rentabilidad para su taller</div>
                  </div>
                </div>
                <a
                  href={getWhatsAppLink('Hola APCR, deseo contratar el Plan Anual de 12 Meses ($199/mes - La opción más económica) para el CRM de mi empresa.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs text-center transition-all shadow-lg shadow-emerald-500/30 block active:scale-95"
                >
                  Elegir 12 Meses ($199/m)
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. WORLD-CLASS TECH STACK BANNER */}
      <section id="stack" className="py-16 bg-[#001737] text-white border-y border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-widest">
                TECNOLOGÍA Y CALIDAD
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Construimos con tecnologías modernas y buenas prácticas.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Aplicamos metodologías modernas para entregar soluciones seguras, funcionales y preparadas para crecer.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-items-center">
              
              {/* 1. TypeScript */}
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded bg-[#3178c6] text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm group-hover:scale-110 transition-transform">
                  TS
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-200">TypeScript</span>
              </div>

              {/* 2. React */}
              <div className="flex items-center gap-2 group">
                <svg className="w-7 h-7 text-[#61dafb] group-hover:scale-110 transition-transform" viewBox="-11.5 -10.23174 23 20.46348">
                  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
                  <g stroke="#61dafb" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                  </g>
                </svg>
                <span className="font-bold text-sm tracking-tight text-slate-200">React</span>
              </div>

              {/* 3. Next.js 14 */}
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-full bg-black text-white border border-slate-700 flex items-center justify-center font-black text-xs font-mono shadow-sm group-hover:scale-110 transition-transform">
                  N
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-200">Next.js 14</span>
              </div>

              {/* 4. Node.js */}
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded bg-[#339933] text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm group-hover:scale-110 transition-transform">
                  JS
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-200">Node.js</span>
              </div>

              {/* 5. Python */}
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-[#3776ab] text-yellow-300 flex items-center justify-center font-bold text-xs font-mono shadow-sm group-hover:scale-110 transition-transform">
                  Py
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-200">Python</span>
              </div>

              {/* 6. AWS */}
              <div className="flex items-center gap-2 group">
                <div className="text-[#ff9900] font-extrabold text-base tracking-tighter group-hover:scale-110 transition-transform font-sans">
                  aws
                </div>
              </div>

              {/* 7. Docker */}
              <div className="flex items-center gap-2 group">
                <svg className="w-7 h-7 text-[#2496ed] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.79 11.23c-.394-1.636-1.745-2.73-3.21-2.73-.393 0-.77.08-1.123.23-.42-1.045-1.424-1.776-2.583-1.776-.328 0-.643.06-.937.168V11.08h7.853zM1.01 12.18c0 4.14 3.73 7.5 8.33 7.5 4.6 0 8.33-3.36 8.33-7.5H1.01z"/>
                </svg>
                <span className="font-bold text-sm tracking-tight text-slate-200">Docker</span>
              </div>

              {/* 8. PostgreSQL & Supabase */}
              <div className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-[#3ecf8e]/20 text-[#3ecf8e] border border-[#3ecf8e]/40 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-200">PostgreSQL</span>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="text-slate-500">Ecosistema de alta velocidad:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 font-mono border border-slate-700/60">Capacitor & PWA</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 text-emerald-300 font-mono border border-slate-700/60">Supabase Realtime</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 text-blue-300 font-mono border border-slate-700/60">Tailwind CSS</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 text-purple-300 font-mono border border-slate-700/60">FastAPI</span>
            <span className="px-2.5 py-1 rounded bg-slate-800/80 text-amber-300 font-mono border border-slate-700/60">Cloudflare Edge CDN</span>
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE LAB & SIMULATOR SECTION */}
      <section id="demo" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
              LABORATORIO INTERACTIVO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Prueba la experiencia que tus clientes van a tener
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Haz clic en los simuladores en vivo para ver cómo funciona el sistema de citas, el menú digital o calcula el retorno financiero de tu inversión (Planes desde $199/mes en adelante).
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setActiveDemoTab('citas')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDemoTab === 'citas'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Simulador de Citas</span>
              </button>
              
              <button
                onClick={() => setActiveDemoTab('menu')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDemoTab === 'menu'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Menú & Comanda Cocina</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('roi')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeDemoTab === 'roi'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Calculadora ROI (Desde $199/mes)</span>
              </button>
            </div>
          </div>

          {/* Interactive Demo Content Area */}
          <div className="max-w-4xl mx-auto">
            
            {/* TAB 1: CITAS */}
            {activeDemoTab === 'citas' && (
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Paso 1: Tu cliente reserva en tu web</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Portal de Agendamiento Online</h3>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nombre del Paciente / Cliente:</label>
                      <input 
                        type="text" 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Servicio Solicitado:</label>
                      <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option>Consulta Especializada</option>
                        <option>Diagnóstico y Mantenimiento</option>
                        <option>Sesión Terapéutica / Estética</option>
                        <option>Revisión Mecánica Integral</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Fecha:</label>
                        <input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hora disponible:</label>
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option>09:00 AM</option>
                          <option>10:30 AM</option>
                          <option>02:00 PM</option>
                          <option>04:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleBookAppointment}
                      className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow cursor-pointer mt-2 flex items-center justify-center gap-2"
                    >
                      <span>{demoAppointmentSent ? '¡Cita Guardada en la Nube!' : 'Confirmar Reservación'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-slate-50/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Paso 2: WhatsApp automatizado al instante</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Vista previa de la alerta</h3>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs space-y-3 font-sans relative">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold border-b border-slate-100 pb-2">
                        <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                        <span>Notificación Automática APCR Bot</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Hola <strong className="text-slate-900">{clientName}</strong>, tu cita para <strong className="text-slate-900">{selectedService}</strong> ha quedado confirmada para el <strong className="text-blue-700">{selectedDate}</strong> a las <strong className="text-blue-700">{selectedTime}</strong> en nuestras instalaciones en San José.
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Te enviaremos un recordatorio automático 24h antes. Si necesitas reprogramar, responde a este mensaje.
                      </p>
                      <div className="text-[10px] text-right text-slate-400 font-mono">
                        10:30 AM <span className="text-blue-500">✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
                    ⚡ <strong>Valor real:</strong> Cero llamadas manuales, cero secretarias perdiendo 4 horas al día agendando por chat.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MENU & COMANDA */}
            {activeDemoTab === 'menu' && (
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Mesa 4 · Menú Digital sin App</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Café & Bistro La Esmeralda</h3>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {[
                      { name: 'Café Especialidad Tarrazú', price: '₡2,500' },
                      { name: 'Tostón con Queso Turrialba', price: '₡3,800' },
                      { name: 'Sandwich de Mechada con Aguacate', price: '₡5,200' }
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div>
                          <div className="font-bold text-slate-800">{item.name}</div>
                          <div className="text-xs font-mono text-slate-500">{item.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const curr = menuCart[item.name] || 0;
                              if (curr > 0) setMenuCart({ ...menuCart, [item.name]: curr - 1 });
                            }}
                            className="w-7 h-7 rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold text-slate-900 w-4 text-center">
                            {menuCart[item.name] || 0}
                          </span>
                          <button
                            onClick={() => {
                              const curr = menuCart[item.name] || 0;
                              setMenuCart({ ...menuCart, [item.name]: curr + 1 });
                            }}
                            className="w-7 h-7 rounded bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSendOrder}
                      className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow cursor-pointer mt-4 flex items-center justify-center gap-2"
                    >
                      <span>{orderSentToKitchen ? '¡Comanda Enviada a Cocina!' : 'Despachar Comanda a Cocina'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 border-b border-slate-800 pb-2">
                      <span className="text-emerald-400 font-bold">PANTALLA DE COCINA (KDS)</span>
                      <span>WebSocket: Conectado</span>
                    </div>
                    
                    <div className="bg-slate-850 p-4 rounded-xl border border-slate-700 text-xs font-mono space-y-3">
                      <div className="flex justify-between text-amber-400 font-bold">
                        <span>ORDEN #CR-104</span>
                        <span>Mesa 4 · Salón</span>
                      </div>
                      
                      <div className="space-y-1.5 text-slate-200 border-t border-b border-slate-800 py-2">
                        {Object.entries(menuCart).map(([name, qty]) => (
                          qty > 0 && (
                            <div key={name} className="flex justify-between">
                              <span>{qty}x {name}</span>
                              <span className="text-emerald-400">Listo</span>
                            </div>
                          )
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between">
                        <span>Impresora Térmica:</span>
                        <span className="text-blue-400">Ticket Impreso ESC/POS</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                    🍔 <strong>Cero comisiones:</strong> No le pagas el 30% a apps intermediarias; cobras directo por SINPE Móvil o datáfono.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ROI CALCULATOR */}
            {activeDemoTab === 'roi' && (
              <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  <div className="md:col-span-7 space-y-5 text-sm">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                        <span>Citas o pedidos que manejas al mes:</span>
                        <span className="font-mono text-blue-600 font-bold">{monthlyClients} clientes</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="300" 
                        value={monthlyClients}
                        onChange={(e) => setMonthlyClients(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                        <span>Valor promedio de cada venta o consulta:</span>
                        <span className="font-mono text-blue-600 font-bold">${avgTicket} USD</span>
                      </div>
                      <input 
                        type="range" 
                        min="15" 
                        max="150" 
                        value={avgTicket}
                        onChange={(e) => setAvgTicket(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1.5">
                        <span>Citas perdidas u olvidadas al mes (No-shows):</span>
                        <span className="font-mono text-red-600 font-bold">{lostAppointments} citas perdidas</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="30" 
                        value={lostAppointments}
                        onChange={(e) => setLostAppointments(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div>• El recordatorio automático de WhatsApp rescata en promedio el 75% de las citas perdidas.</div>
                      <div>• Ahorras ~1 hora diaria de atención repetitiva en WhatsApp.</div>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-gradient-to-b from-[#002050] to-[#001025] rounded-xl p-6 text-white text-center border border-blue-900 shadow-lg">
                    <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                      BENEFICIO MENSUAL ESTIMADO
                    </div>

                    <div className="font-mono text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-1">
                      +${totalValueGenerated}
                    </div>
                    <div className="text-xs text-slate-300 mb-4">
                      USD recuperados al mes
                    </div>

                    <div className="space-y-1 text-xs border-t border-b border-blue-900/60 py-3 text-left">
                      <div className="flex justify-between text-slate-300">
                        <span>Citas rescatadas:</span>
                        <span className="font-mono text-emerald-300 font-bold">+${lostRevenueRecovered}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Tiempo ahorrado en chat:</span>
                        <span className="font-mono text-emerald-300 font-bold">+${timeSavedValue}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Inversión base plan APCR:</span>
                        <span className="font-mono text-red-400 font-bold">-${basePlanCost}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs font-bold text-emerald-400">
                      RETORNO DE INVERSIÓN: {roiPercentage}%
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      El sistema se paga solo rescatando apenas 4 citas al mes.
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 9. METHODOLOGY SECTION (4 Quick Steps) */}
      <section id="metodologia" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2 block">
              METODOLOGÍA DE ENTREGA RÁPIDA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              De tu necesidad a producción sin complicaciones
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Proceso estructurado para que tengas tu software funcionando en días, no en meses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: '1. Diagnóstico de 25 min',
                desc: 'Nos reunimos por llamada o WhatsApp para entender exactamente qué proceso te está quitando tiempo o dinero en tu negocio.',
                color: 'bg-blue-600'
              },
              {
                step: '02',
                title: '2. Prototipo en 48 Horas',
                desc: 'Te mostramos una maqueta visual y funcional interactiva de cómo se verá tu sistema antes de escribir la primera línea de base de datos.',
                color: 'bg-emerald-600'
              },
              {
                step: '03',
                title: '3. Despliegue en Servidor',
                desc: 'Configuramos tu dominio, servidores cloud en AWS, base de datos PostgreSQL, certificado de seguridad SSL y conexiones de WhatsApp.',
                color: 'bg-purple-600'
              },
              {
                step: '04',
                title: '4. Soporte & Evolución',
                desc: 'No te dejamos solo. Nuestro equipo se encarga del mantenimiento, respaldos diarios y ajustes mensuales continuos bajo tu plan.',
                color: 'bg-orange-600'
              }
            ].map((m) => (
              <div key={m.step} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <span className={`inline-block px-2.5 py-1 rounded-md text-white font-mono text-xs font-bold mb-3 ${m.color}`}>
                  {m.step}
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-2">{m.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL CORPORATE CTA (WhatsApp + Email) */}
      <section className="py-16 bg-[#081225] text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
            ATENCIÓN TÉCNICA DIRECTA
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            ¿Listo para automatizar y hacer crecer tu negocio?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Habla directamente con un ingeniero de software de nuestro equipo. Sin comerciales con discursos aburridos: evaluamos tu caso y te decimos la solución exacta en minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink('Hola APCR, deseo cotizar software para mi empresa (Planes desde $199/mes en adelante).')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Escribir por WhatsApp (+506 7069-3708)</span>
            </a>

            <a
              href="mailto:ventas@apcr.online"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
            >
              <Mail className="w-4 h-4" />
              <span>ventas@apcr.online</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>San José, Costa Rica</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acuerdo de Confidencialidad (NDA) disponible</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Respuesta en menos de 2 horas hábiles</span>
            </div>
          </div>

        </div>
      </section>

      {/* 11. CORPORATE FOOTER (Inspirado en Microsoft Costa Rica) */}
      <footer className="bg-[#050b17] text-slate-400 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Demos de Apps</h4>
              <ul className="space-y-2">
                <li><a href="#demos-en-vivo" className="hover:text-white transition-colors">Titan CrossFit Box</a></li>
                <li><a href="#demos-en-vivo" className="hover:text-white transition-colors">Pulse Fitness Club</a></li>
                <li><a href="#demos-en-vivo" className="hover:text-white transition-colors">Crave Burger QSR</a></li>
                <li><a href="#demos-en-vivo" className="hover:text-white transition-colors">Lumina Dental Clinic</a></li>
                <li><a href="#demos-en-vivo" className="hover:text-white transition-colors">Aurelio Ristorante</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Stack & Cloud</h4>
              <ul className="space-y-2">
                <li>.NET & C# Enterprise</li>
                <li>React & Next.js</li>
                <li>Node.js & Python</li>
                <li>AWS & Docker</li>
                <li>PostgreSQL & MongoDB</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Empresa & Grupo</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onReturnToPortal} className="hover:text-white transition-colors cursor-pointer text-left">
                    División Alfombras Industriales
                  </button>
                </li>
                <li><a href="#metodologia" className="hover:text-white transition-colors">Metodología de Entrega</a></li>
                <li><a href="#modelo-inversion" className="hover:text-white transition-colors">Planes desde $199/mes en adelante</a></li>
                <li>San José, Costa Rica</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 text-sm">Redes Oficiales</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.instagram.com/alfombraspersonalizadas.cr/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Instagram (@alfombraspersonalizadas.cr)
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/alfombraspersonalizadascostarica" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Facebook Oficial
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@alfombraspersonal" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    TikTok (@alfombraspersonal)
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/50670693708" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-emerald-400 font-semibold">
                    WhatsApp (+506 7069-3708)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{lang === 'es' ? 'Español (Costa Rica)' : 'English (Costa Rica)'}</span>
            </div>
            <div>
              <span>© 2026 APCR Digital Solutions & Alfombras Personalizadas CR. Todos los derechos reservados.</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Bottom Sticky Quick-Action Bar for Mobile (Always reachable by thumb) */}
      <aside aria-label="Acciones Rápidas Móvil" className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="#demos-en-vivo"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 text-center"
        >
          <Play className="w-3.5 h-3.5 fill-white shrink-0" />
          <span>Probar 9 Apps</span>
        </a>

        <a
          href={getWhatsAppLink('Hola APCR, deseo cotizar software o app móvil para mi empresa (Planes desde $199/mes en adelante).')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#25D366] active:bg-[#20bd5a] text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 text-center"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-2.5 rounded-xl bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center cursor-pointer"
          title="Menú de Secciones"
        >
          <Menu className="w-4 h-4" />
        </button>
      </aside>

    </div>
  );
};
