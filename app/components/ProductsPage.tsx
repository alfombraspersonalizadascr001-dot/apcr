import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Droplets,
  Tag,
  Gift,
  Mail
} from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);
import { airlockAudio } from '../utils/airlockSound';

interface ProductsPageProps {
  onReturnToPortal: () => void;
  lang: 'es' | 'en';
  onToggleLang: (lang: 'es' | 'en') => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onReturnToPortal,
  lang,
  onToggleLang
}) => {
  // Ensure music is completely stopped (User request: silencio en pagina de productos)
  useEffect(() => {
    airlockAudio.stopMusic();
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State for order tracking form simulation
  const [trackingUser, setTrackingUser] = useState('');
  const [trackingPass, setTrackingPass] = useState('');
  const [trackingFeedback, setTrackingFeedback] = useState<string | null>(null);

  const whatsappNumber = "+506 6063-8062";
  const whatsappClean = "50660638062";
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20productos%20y%20alfombras`;

  const t = {
    es: {
      returnBtn: "Volver al Portal",
      navHome: "Inicio",
      navWork: "Nuestros Trabajos",
      navAbout: "Sobre Nosotros",
      navTracking: "Estado de mi Pedido",
      navContact: "Contacto",
      waBtn: "WhatsApp +506 6063-8062",
      discoverTitle: "Descubre nuestros productos",
      discoverSubtitle: "Ingeniería de materiales, personalización de alta precisión y calidad corporativa.",
      featuresHeading: "Especificaciones y Características Técnicas",
      quoteBtn: "Cotizar por WhatsApp",
      viewSpecs: "Ver características",
      worksTitle: "Nuestros Trabajos Recientes",
      worksSubtitle: "Marcas líderes en Costa Rica confían su imagen corporativa en APCR.",
      trackingTitle: "Estado de mi Pedido",
      trackingSubtitle: "Ingresa tu usuario y contraseña para consultar el estado de tu pedido",
      userInput: "Tu usuario",
      passInput: "Tu contraseña",
      trackingBtn: "Consultar Estado",
      noAccount: "¿No tienes cuenta? Regístrate aquí",
      aboutTitleStart: "Hola, somos Alfombras ",
      aboutTitleHighlight: "Personalizadas",
      aboutTitleEnd: " de Costa Rica",
      aboutP1: "Somos los fabricantes de las alfombras atrapa-mugre más increíbles en Costa Rica. Nos apasiona lo que hacemos y lo hacemos con excelencia, nuestros trabajos hablan por nosotros.",
      aboutP2: "Nuestros clientes se vuelven nuestros amigos, somos afortunados de crear a partir de los logos de las empresas de nuestros clientes, así damos valor a sus marcas.",
      aboutBtn: "Contrátanos, Somos los Mejores",
      rightsNotice: "APCR® Marca Registrada. Todos los derechos reservados.",
      slides: [
        {
          id: 'personalizadas',
          tag: 'Tráfico Pesado y Personalizado',
          title: 'Alfombras Atrapa-Mugre con Logotipo Indeleble',
          desc: 'La primera impresión de tu negocio. Fabricadas en rizo de vinil continuo (spaghetti) de alta densidad con inserción indeleble computarizada y borde biselado antideslizante.',
          image: '/personalizadas_burgerhouse.jpg',
          specs: ['Filamento de PVC continuo', 'Resistente a rayos UV y lluvia', 'Tráfico comercial extremo', 'Fácil lavado con agua a presión']
        },
        {
          id: 'super_seco',
          tag: 'Alta Retención de Líquidos',
          title: 'Alfombras Súper Seco',
          desc: 'Diseñadas para retener hasta 4 litros de líquido por metro cuadrado. Fibras hidrófilas de microfibra de alta torsión sobre base de caucho nitrilo vulcanizado.',
          image: '/super_seco_home.png',
          specs: ['Absorción extrema de humedad', 'Secado ultra-rápido de suelas', 'Base de caucho antideslizante', 'Ideal para lluvias y zonas húmedas']
        },
        {
          id: 'dry_max',
          tag: 'Doble Acción: Raspado y Retención',
          title: 'Alfombras Dry Max',
          desc: 'Patrón acanalado termoformado de máxima acción raspadora que desprende lodo, arena y polvo mientras retiene la humedad en sus canales inferiores.',
          image: '/dry_max_composition.png',
          specs: ['Estructura bi-nivel reforzada', 'Remoción activa de suciedad pesada', 'Borde perimetral colector de agua', 'Larga vida útil sin deformación']
        }
      ],
      quickProducts: [
        {
          id: 'personalizadas',
          name: 'Alfombras Personalizadas',
          subtitle: 'Logos indelebles y alto tránsito',
          image: '/personalizadas_burgerhouse.jpg'
        },
        {
          id: 'super_seco',
          name: 'Alfombras Súper Seco',
          subtitle: 'Absorción masiva de humedad',
          image: '/super_seco_home.png'
        },
        {
          id: 'dry_max',
          name: 'Alfombras Dry Max',
          subtitle: 'Raspado y retención extrema',
          image: '/dry_max_composition.png'
        },
        {
          id: 'stickers',
          name: 'Stickers con Imán',
          subtitle: 'Para vehículos y flotillas',
          image: '/stickers_imantados.jpg'
        },
        {
          id: 'promocionales',
          name: 'Artículos Promocionales',
          subtitle: 'Lapiceros, gorras, vasos y paraguas',
          image: '/articulos_promocionales.jpg'
        }
      ]
    },
    en: {
      returnBtn: "Return to Portal",
      navHome: "Home",
      navWork: "Our Portfolio",
      navAbout: "About Us",
      navTracking: "Order Status",
      navContact: "Contact",
      waBtn: "WhatsApp +506 6063-8062",
      discoverTitle: "Discover our products",
      discoverSubtitle: "High-precision engineering, customized branding, and commercial-grade durability.",
      featuresHeading: "Technical Specifications & Features",
      quoteBtn: "Quote on WhatsApp",
      viewSpecs: "View specs",
      worksTitle: "Recent Client Projects",
      worksSubtitle: "Leading corporations across Costa Rica trust their brand identity to APCR.",
      trackingTitle: "Order Status",
      trackingSubtitle: "Enter your username and password to track your order live",
      userInput: "Your username",
      passInput: "Your password",
      trackingBtn: "Check Order Status",
      noAccount: "Don't have an account? Register here",
      aboutTitleStart: "Hello, we are Custom Floor Mats ",
      aboutTitleHighlight: "APCR",
      aboutTitleEnd: " Costa Rica",
      aboutP1: "We are the manufacturers of the most incredible dirt-trapping mats in Costa Rica. We are passionate about our craft and deliver excellence — our work speaks for itself.",
      aboutP2: "Our clients become lifelong partners. We have the privilege of elevating your company logo into an enduring, premium first impression.",
      aboutBtn: "Hire Us, We Are The Best",
      rightsNotice: "APCR® Registered Trademark. All Rights Reserved.",
      slides: [
        {
          id: 'personalizadas',
          tag: 'Heavy-Duty & Custom Inlay',
          title: 'Custom Logo Floor Mats',
          desc: 'The defining first impression for corporate entrances. Engineered with high-density continuous PVC loop (spaghetti vinyl) with computer-cut indelible logo inlay and beveled safety edges.',
          image: '/personalizadas_burgerhouse.jpg',
          specs: ['Continuous PVC filament coil', 'UV & heavy rain resistant', 'Commercial extreme foot-traffic', 'Easy power-wash cleaning']
        },
        {
          id: 'super_seco',
          tag: 'Maximum Water Retention',
          title: 'Super Seco Floor Mats',
          desc: 'Engineered to trap up to 4 liters of liquid per square meter. High-twist hydrophobic microfiber over a vulcanized nitrile rubber non-slip foundation.',
          image: '/super_seco_home.png',
          specs: ['Extreme liquid absorbency', 'Instant shoe sole drying', 'Heavy-duty nitrile backing', 'Perfect for rainy seasons']
        },
        {
          id: 'dry_max',
          tag: 'Dual Action: Scraping & Drying',
          title: 'Dry Max Floor Mats',
          desc: 'Thermoformed bi-level pattern designed for aggressive dirt scraping, releasing mud, gravel, and sand while locking water below shoe level.',
          image: '/dry_max_composition.png',
          specs: ['Reinforced bi-level waffle pattern', 'Heavy scraping action', 'Raised water-dam border', 'Crush-resistant lifespan']
        }
      ],
      quickProducts: [
        {
          id: 'personalizadas',
          name: 'Custom Logo Mats',
          subtitle: 'Indelible logos & heavy traffic',
          image: '/personalizadas_burgerhouse.jpg'
        },
        {
          id: 'super_seco',
          name: 'Super Seco Mats',
          subtitle: 'Massive moisture absorbency',
          image: '/super_seco_home.png'
        },
        {
          id: 'dry_max',
          name: 'Dry Max Mats',
          subtitle: 'Bi-level scraping & drying',
          image: '/dry_max_composition.png'
        },
        {
          id: 'stickers',
          name: 'Magnetic Car Stickers',
          subtitle: 'Vehicle fleet magnetic decals',
          image: '/stickers_imantados.jpg'
        },
        {
          id: 'promocionales',
          name: 'Promotional Merchandise',
          subtitle: 'Pens, caps, tumblers & umbrellas',
          image: '/articulos_promocionales.jpg'
        }
      ]
    }
  }[lang];

  // Auto slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % t.slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [t.slides.length]);

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // audio silenced
    if (!trackingUser.trim()) {
      setTrackingFeedback(lang === 'es' ? 'Por favor ingresa tu usuario' : 'Please enter your username');
      return;
    }
    setTrackingFeedback(
      lang === 'es'
        ? `Consultando pedido para "${trackingUser}"... Conectando con CRM APCR...`
        : `Checking order for "${trackingUser}"... Connecting to APCR CRM...`
    );
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20consultar%20el%20estado%20de%20mi%20pedido%20para%20el%20usuario%3A%20${encodeURIComponent(trackingUser)}`, '_blank');
    }, 900);
  };

  const scrollToSection = (id: string) => {
    // audio silenced
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-slate-900 font-sans selection:bg-black selection:text-white pb-20">
      
      {/* 1. CINTILLO SUPERIOR // HEADER ESTILO HP */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo APCR */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onReturnToPortal}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
              title={lang === 'es' ? 'Volver al portal principal' : 'Return to main portal'}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center p-1 border border-slate-300 group-hover:border-slate-400 transition-all">
                <img src="/logo.png" alt="APCR Monogram" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <span className="font-extrabold tracking-tight text-slate-950 text-base leading-none block">APCR</span>
                <span className="text-[10px] font-sans text-slate-500 font-medium leading-none block mt-0.5">PRODUCTOS</span>
              </div>
            </button>
          </div>

          {/* Secciones de apcr.online */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => scrollToSection('descubre')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              {lang === 'es' ? 'Productos' : 'Products'}
            </button>
            <button 
              onClick={() => scrollToSection('trabajos')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              {t.navWork}
            </button>
            <button 
              onClick={() => scrollToSection('sobre-nosotros')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1"
            >
              {t.navAbout}
            </button>
            <button 
              onClick={() => scrollToSection('estado-pedido')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-slate-900" />
              <span>{t.navTracking}</span>
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="hover:text-slate-950 transition-colors cursor-pointer py-1 flex items-center gap-1 text-slate-900 font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
              <span>{t.navContact}</span>
            </button>
          </nav>

          {/* Controles de la derecha: Idioma, Regresar a Compuertas, WhatsApp */}
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Quick Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-white" />
              <span>{whatsappNumber}</span>
            </a>

            {/* Language switch */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-300">
              <button
                onClick={() => {
                  onToggleLang('es');
                  // audio silenced
                }}
                className={`px-2.5 py-1 text-xs font-sans font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'es' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => {
                  onToggleLang('en');
                  // audio silenced
                }}
                className={`px-2.5 py-1 text-xs font-sans font-bold rounded-full transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                EN
              </button>
            </div>

            {/* Botón Volver a las compuertas */}
            <button
              onClick={onReturnToPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-sans font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.returnBtn}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. CARRUSEL HERO NO TAN GRANDE // 3 TIPOS DE ALFOMBRA */}
      <section id="inicio" className="pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden min-h-[420px] md:min-h-[460px] flex items-center">
          
          {/* Slides */}
          {t.slides.map((slide, idx) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Texto y Specs */}
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-sans font-bold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>{slide.tag}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                  {slide.title}
                </h1>
                
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {slide.desc}
                </p>

                {/* Specs pills */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {slide.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3 pt-4">
                  <a
                    href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20la%20alfombra%3A%20${encodeURIComponent(slide.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white" />
                    <span>{t.quoteBtn}</span>
                  </a>
                  <button
                    onClick={() => scrollToSection(slide.id)}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-300 transition-all cursor-pointer"
                  >
                    <span>{t.viewSpecs}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Imagen del Slide */}
              <div className="w-full md:w-1/2 flex items-center justify-center relative">
                <div className="w-full max-w-md h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-50 relative group">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          ))}

          {/* Controles del Carrusel (Flechas y Dots) */}
          <button
            onClick={() => {
              // audio silenced
              setCurrentSlide(prev => (prev - 1 + t.slides.length) % t.slides.length);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              // audio silenced
              setCurrentSlide(prev => (prev + 1) % t.slides.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {t.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // audio silenced
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN "DESCUBRE NUESTROS PRODUCTOS" // ESTILO HP CON LÍNEA MUY DELGADA */}
      <section id="descubre" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {t.discoverTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {t.discoverSubtitle}
          </p>
        </div>

        {/* Grid estilo HP: separados por una línea muy delgada */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-slate-200">
          {t.quickProducts.map((prod) => (
            <div 
              key={prod.id}
              onClick={() => scrollToSection(prod.id)}
              className="group p-5 flex flex-col items-center text-center cursor-pointer hover:bg-slate-50/80 transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-4 p-2 flex items-center justify-center">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-900 transition-colors">
                {prod.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-tight">
                {prod.subtitle}
              </p>

              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                <span>{lang === 'es' ? 'Explorar' : 'Explore'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DESARROLLO DE CADA PRODUCTO CON ESPACIO DE CARACTERÍSTICAS */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* PRODUCTO 1: ALFOMBRAS PERSONALIZADAS */}
        <div id="personalizadas" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto principal y galería real con medidas */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img 
                  src="/personalizadas_burgerhouse.jpg" 
                  alt="Alfombra Atrapamugre Personalizada Burger House 120x210cm" 
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-semibold">
                  Más Vendido · 120 × 210 cm
                </div>
              </div>

              {/* Galería exclusiva con las fotos reales y medidas */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 group relative">
                  <img src="/personalizadas_sapore.jpg" alt="Sapore Trattoria 120x200cm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-1 inset-x-1 bg-black/75 text-white text-[9px] text-center rounded py-0.5 font-medium">120×200cm</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 group relative">
                  <img src="/personalizadas_lomusa.jpg" alt="Lomusa 70x85cm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-1 inset-x-1 bg-black/75 text-white text-[9px] text-center rounded py-0.5 font-medium">70×85cm</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 group relative">
                  <img src="/personalizadas_stationburger.jpg" alt="Station Burger 100x150cm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-1 inset-x-1 bg-black/75 text-white text-[9px] text-center rounded py-0.5 font-medium">100×150cm</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 group relative">
                  <img src="/personalizadas_chachagua.jpg" alt="Fitness Chachagua 100x120cm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-1 inset-x-1 bg-black/75 text-white text-[9px] text-center rounded py-0.5 font-medium">100×120cm</span>
                </div>
              </div>
            </div>

            {/* Información y Características */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-sans font-bold text-slate-900 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                  {lang === 'es' ? 'Alfombra de Entrada Corporativa' : 'Corporate Entrance Mat'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
                  {lang === 'es' ? 'Alfombras Personalizadas con Logotipo' : 'Custom Logo Floor Mats'}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {lang === 'es' 
                    ? 'Fabricadas a partir de filamentos continuos de PVC tipo rizo (spaghetti) de alto tránsito. El logotipo de tu empresa se inserta mediante corte computarizado termo-fusionado, garantizando que jamás se borre ni se desgaste.'
                    : 'Crafted from continuous vinyl loop PVC coils engineered for high-volume commercial entrances. Your corporate logo is digitally inlaid and thermo-welded for indelible durability.'}
                </p>
              </div>

              {/* Espacio de características técnicas */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-slate-800 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>{t.featuresHeading}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">MATERIAL</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'PVC continuo de alto impacto (Rizo)' : 'Continuous PVC coil filament'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'NIVEL DE TRÁFICO' : 'TRAFFIC LEVEL'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Tráfico Pesado (Comercial / Industrial)' : 'Heavy Commercial Traffic'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'ACABADO DE SEGURIDAD' : 'SAFETY FINISH'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Borde biselado antideslizante 2.5cm' : 'Beveled safety rubber ramp 2.5cm'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'PERSONALIZACIÓN' : 'CUSTOMIZATION'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Inserción indeleble computarizada' : 'Computerized indelible logo inlay'}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20alfombras%20personalizadas%20con%20logotipo`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{t.quoteBtn}</span>
                </a>
                <span className="text-xs font-sans text-slate-500">
                  {lang === 'es' ? 'Entrega en todo Costa Rica · Asesoría directa' : 'Nationwide Costa Rica delivery'}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* PRODUCTO 2: ALFOMBRAS SÚPER SECO */}
        <div id="super_seco" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto principal y miniaturas reales (100% limpias sin texto) */}
            <div className="lg:col-span-6 space-y-4 lg:order-2">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img 
                  src="/super_seco_home.png" 
                  alt="Alfombra Súper Seco APCR" 
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-black/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-semibold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>4L/m² ABSORCIÓN</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/super_seco_boots.jpg" alt="Tráfico Húmedo y Lluvias" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/super_seco_fibra_clean.png" alt="Fibra Olefina Absorbente" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/super_seco_backing_clean.png" alt="Base Antideslizante Vulcanizada" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Información y Características */}
            <div className="lg:col-span-6 space-y-6 text-left lg:order-1">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src="/super_seco_logo.png" 
                    alt="Marca Oficial Súper Seco" 
                    className="h-9 sm:h-11 w-auto object-contain drop-shadow-sm" 
                  />
                  <span className="text-xs font-sans font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                    {lang === 'es' ? 'Marca Registrada' : 'Registered Brand'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                  {lang === 'es' ? 'Alfombras Súper Seco' : 'Super Seco Floor Mats'}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {lang === 'es' 
                    ? 'La solución definitiva para temporadas lluviosas y entradas de alto tráfico. Diseñada con microfibras de olefina ultra-absorbentes capaces de retener hasta 4 litros de agua por metro cuadrado, evitando resbalones y pisos manchados.'
                    : 'The definitive defense against rainy seasons and high-traffic wet footfalls. Engineered with ultra-absorbent olefin microfibers holding up to 4 liters of water per square meter.'}
                </p>
              </div>

              {/* Espacio de características técnicas */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-slate-800 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>{t.featuresHeading}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'CAPACIDAD DE ABSORCIÓN' : 'ABSORPTION CAPACITY'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Hasta 4 litros de agua por m²' : 'Up to 4 liters per sq meter'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'COMPOSICIÓN' : 'COMPOSITION'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Olefina hidrófila micro-trenzada' : 'Hydrophilic micro-twisted olefin'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'BASE ANTIDESLIZANTE' : 'BACKING'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Caucho nitrilo vulcanizado que no mancha' : 'Non-staining vulcanized nitrile rubber'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'SECADO' : 'DRYING SPEED'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Evaporación acelerada de suelas' : 'Instant shoe moisture evaporation'}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20alfombras%20S%C3%BAper%20Seco`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{t.quoteBtn}</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* PRODUCTO 3: ALFOMBRAS DRY MAX */}
        <div id="dry_max" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto principal y miniaturas reales oficiales */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img 
                  src="/dry_max_entrance.png" 
                  alt="Alfombra Dry Max en Entrada Corporativa" 
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>TRÁNSITO PESADO · 100% CR</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/dry_max_shoe_action.png" alt="Acción Rascadora Calzado" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/dry_max_fiber.png" alt="Fibra Rascadora Continua" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100">
                  <img src="/dry_max_backing.png" alt="Base Impermeable Antideslizante" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Información y Características */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <img 
                    src="/dry_max_logo.png" 
                    alt="Marca Oficial Dry Max" 
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm rounded-full shrink-0" 
                  />
                  <div>
                    <span className="text-xs font-sans font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block">
                      {lang === 'es' ? '100% Costarricense · Fabricación Propia' : '100% Costa Rican · Proprietary Manufacturing'}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                      {lang === 'es' ? 'Alfombras Dry Max' : 'Dry Max Floor Mats'}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {lang === 'es' 
                    ? 'No existe en el país una alfombra que limpie y seque mejor. Diseñada con filamentos de vinil continuo de alta resistencia que raspan a fondo la suela del calzado, absorben la humedad y retienen la suciedad pesada en sus canales para proteger tus pisos.'
                    : 'No other entrance mat cleans and dries footwear better. Engineered with heavy-duty vinyl loop filaments that deeply scrape shoe soles, trap water, and isolate heavy dirt.'}
                </p>
              </div>

              {/* Espacio de características técnicas */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-slate-800 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>{t.featuresHeading}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'MEDIDAS DISPONIBLES' : 'SIZING OPTIONS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Estándar 116 × 72 cm y A Tu Medida' : 'Standard 116 × 72 cm & Custom Sized'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'TRIPLE ACCIÓN' : 'TRIPLE ACTION'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Limpia a fondo, absorbe y seca' : 'Deep cleans, absorbs & dries footwear'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'TRÁNSITO RECOMENDADO' : 'TRAFFIC RATING'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Tránsito pesado comercial e industrial' : 'Heavy commercial & industrial traffic'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'MANTENIMIENTO' : 'MAINTENANCE'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Fácil de lavar, secado acelerado' : 'Quick power-wash & accelerated drying'}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20alfombras%20Dry%20Max%20(medida%20est%C3%A1ndar%20116x72cm%20o%20a%20mi%20medida)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{t.quoteBtn}</span>
                </a>
              </div>

            </div>
          </div>

          {/* Banner Oficial Dry Max: 100% Costarricense & Calidad Garantizada */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
              <img 
                src="/dry_max_banner.png" 
                alt="Dry Max - La más alta calidad del mercado. 100% Costarricense" 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>
        </div>

        {/* PRODUCTO 4: STICKERS CON IMÁN */}
        <div id="stickers" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto principal */}
            <div className="lg:col-span-6 space-y-4 lg:order-2">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img 
                  src="/stickers_imantados.jpg" 
                  alt="Stickers con Imán para Carros APCR" 
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-slate-900/85 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-bold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-900" />
                  <span>IMÁN AUTOMOTRIZ 0.8MM</span>
                </div>
              </div>
            </div>

            {/* Información y Características */}
            <div className="lg:col-span-6 space-y-6 text-left lg:order-1">
              <div>
                <span className="text-xs font-sans font-bold text-slate-900 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                  {lang === 'es' ? 'Publicidad Móvil y Flotillas' : 'Fleet & Vehicle Branding'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
                  {lang === 'es' ? 'Stickers con Imán (Magnéticos)' : 'Magnetic Vehicle Stickers'}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {lang === 'es' 
                    ? 'Identifica vehículos comerciales, camionetas y flotillas de forma removible sin dañar la pintura original. Láminas magnéticas de calibre pesado de 0.8 mm con impresión digital UV curable de alta definición y laminado de protección solar.'
                    : 'Transform your commercial vehicles and fleet with removable magnetic decals without harming the paint. Heavy 0.8mm automotive magnetic substrate with UV curable inks and protective clear laminate.'}
                </p>
              </div>

              {/* Espacio de características técnicas */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-slate-800 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>{t.featuresHeading}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'CALIBRE MAGNÉTICO' : 'MAGNETIC THICKNESS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? '0.8 mm automotriz de alta adherencia' : '0.8mm heavy automotive strength'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'TECNOLOGÍA DE IMPRESIÓN' : 'PRINTING TECHNOLOGY'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Tintas UV indelebles + laminado mate/brillo' : 'UV durable inks + matte/gloss lamination'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'COMPATIBILIDAD' : 'SURFACE COMPATIBILITY'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Puertas de autos, camiones y superficies metálicas' : 'Car doors, trucks & metal surfaces'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? 'CORTE Y MEDIDAS' : 'CUTTING & SHAPES'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Corte recto o troquelado a la forma del logo' : 'Straight rectangular or custom die-cut'}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20stickers%20con%20im%C3%A1n%20para%20veh%C3%ADculos`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{t.quoteBtn}</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* PRODUCTO 5: ARTÍCULOS PROMOCIONALES (LAPICEROS, GORRAS, VASOS Y PARAGUAS) */}
        <div id="promocionales" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto principal */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm relative group">
                <img 
                  src="/articulos_promocionales.jpg" 
                  alt="Artículos Promocionales APCR: Lapiceros, Gorras, Vasos y Paraguas" 
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/85 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-sans font-bold flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-slate-900" />
                  <span>Merchandising Corporativo</span>
                </div>
              </div>
            </div>

            {/* Información y Características */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-sans font-bold text-slate-900 font-semibold bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                  {lang === 'es' ? 'Identidad Corporativa y Merchandising' : 'Corporate Merchandising'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2">
                  {lang === 'es' ? 'Artículos Promocionales en General' : 'Custom Corporate Merchandise'}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {lang === 'es' 
                    ? 'Eleva la presencia de tu marca con artículos publicitarios de categoría premium. Fabricamos kits corporativos completos que incluyen lapiceros metálicos grabados con láser, gorras estructuradas con bordado 3D, vasos y termos de acero inoxidable, y paraguas reforzados antiviento.'
                    : 'Elevate your corporate gifting and brand presence with premier promotional merchandise: executive laser-engraved pens, 3D embroidered caps, insulated stainless tumblers, and windproof umbrellas.'}
                </p>
              </div>

              {/* Espacio de características de los 4 artículos */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-5 space-y-3">
                <h4 className="text-xs font-sans font-bold text-slate-800 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-900" />
                  <span>{t.featuresHeading}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? '1. LAPICEROS EJECUTIVOS' : '1. EXECUTIVE PENS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Cuerpo metálico negro mate con grabado láser indeleble' : 'Matte black metal body with laser engraving'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? '2. GORRAS CORPORATIVAS' : '2. CORPORATE CAPS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Algodón peinado premium, 6 paneles y bordado 3D de alta definición' : 'Premium combed cotton, 6-panel with 3D embroidery'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? '3. VASOS Y TERMOS' : '3. TUMBLERS & MUGS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Acero inoxidable doble pared al vacío con logo grabado' : 'Double-wall vacuum stainless steel with etched logo'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-sans text-[10px]">{lang === 'es' ? '4. PARAGUAS REFORZADOS' : '4. REINFORCED UMBRELLAS'}</span>
                    <strong className="text-slate-800 font-semibold">{lang === 'es' ? 'Sistema automático antiviento con serigrafía corporativa' : 'Automatic windproof system with screen-printed branding'}</strong>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20cotizar%20art%C3%ADculos%20promocionales%20(lapiceros%2C%20gorras%2C%20vasos%2C%20paraguas)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>{t.quoteBtn}</span>
                </a>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* 5. NUESTROS TRABAJOS RECIENTES */}
      <section id="trabajos" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {t.worksTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {t.worksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { img: '/trabajo_paradise_bay.jpg', name: 'Paradise Bay Hotel Boutique' },
            { img: '/trabajo_casa_mariposa.jpg', name: 'Casa Mariposa' },
            { img: '/trabajo_burger_house.jpg', name: 'BH Burger House' },
            { img: '/trabajo_la_street.jpg', name: 'La Street Gastrofusión' },
            { img: '/trabajo_move_detailing.jpg', name: 'MOVE Car Detailing' },
            { img: '/trabajo_uisil.jpg', name: 'UISIL Universidad' },
            { img: '/trabajo_bekvam.jpg', name: 'BEKVÄM' },
            { img: '/trabajo_dra_yorleny.jpg', name: 'Dra. Yorleny Salazar Clínica Dental' },
            { img: '/trabajo_el_chante_papo.jpg', name: 'El Chante de Papo' },
            { img: '/trabajo_taru.jpg', name: 'TARU Costa Rican Flavours' },
          ].map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-xs hover:shadow-md transition-all">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-semibold leading-tight drop-shadow-sm">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      {/* 6. SECCIÓN "ESTADO DE MI PEDIDO" */}
      <section id="estado-pedido" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Columna Izquierda: Formulario de consulta */}
            <div className="lg:col-span-6 text-left space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                  <Truck className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                  {t.trackingTitle}
                </h3>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                {t.trackingSubtitle}
              </p>

              <form onSubmit={handleTrackingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'es' ? 'Usuario' : 'Username'}
                  </label>
                  <input
                    type="text"
                    value={trackingUser}
                    onChange={(e) => setTrackingUser(e.target.value)}
                    placeholder={t.userInput}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={trackingPass}
                    onChange={(e) => setTrackingPass(e.target.value)}
                    placeholder={t.passInput}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm text-slate-900 bg-white placeholder:text-slate-400 transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm tracking-wide bg-black hover:bg-slate-800 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                >
                  {t.trackingBtn}
                </button>
              </form>

              {trackingFeedback && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-700">
                  {trackingFeedback}
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20quisiera%20crear%20mi%20cuenta%20para%20seguimiento%20de%20pedido`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {t.noAccount}
                </a>
              </div>

            </div>

            {/* Columna Derecha: Tarjeta con imagen de alfombra personalizada */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
                <img 
                  src="/personalizadas_lomusa.jpg" 
                  alt="Alfombra Personalizada APCR 70x85cm" 
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SECCIÓN "SOBRE NOSOTROS" // TAL CUAL EL SCREENSHOT SUBIDO */}
      <section id="sobre-nosotros" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg min-h-[380px] md:min-h-[440px] flex items-center justify-center text-center p-8 md:p-14">
          
          {/* Fondo con las alfombras La Chismosa y Pineapple Tour */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/sobre_nosotros_banner.png')` }}
          />
          
          {/* Overlay suave para legibilidad */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

          {/* Contenido */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug">
              {t.aboutTitleStart}
              <span className="text-slate-950 underline decoration-slate-400 underline-offset-4 italic font-serif">
                {t.aboutTitleHighlight}
              </span>
              {t.aboutTitleEnd}
            </h2>

            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
              {t.aboutP1}
            </p>

            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
              {t.aboutP2}
            </p>

            {/* Botón con degradado exactamente como en la imagen */}
            <div className="pt-4">
              <a
                href={`https://wa.me/${whatsappClean}?text=Hola%20APCR%2C%20vi%20su%20p%C3%A1gina%20y%20quisiera%20contratar%20sus%20servicios`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm md:text-base bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/30 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-white fill-white" />
                <span>{t.aboutBtn}</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 8. SECCIÓN CONTACTO // TAL CUAL APCR.ONLINE (HABLEMOS DE TU PROYECTO) */}
      <section id="contacto" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl min-h-[540px] flex items-center">
          
          {/* Fondo con la alfombra Shop Time exactamente como apcr.online */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/contact-bg.jpg')` }}
          />
          
          {/* Overlay suave para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 md:to-white/20 backdrop-blur-[1px]" />

          {/* Contenido */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Columna Izquierda: Información de contacto */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                    Hablemos de tu <br />
                    <span className="bg-gradient-to-r from-[#f59e0b] via-[#f97316] to-[#ec4899] bg-clip-text text-transparent">
                      Proyecto
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mt-3 max-w-lg leading-relaxed">
                    Estamos listos para personalizar la imagen de tu empresa. Escríbenos por WhatsApp o correo.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  {/* WhatsApp Oficial */}
                  <a 
                    href="https://wa.me/50670693708?text=Hola%20APCR%2C%20quisiera%20hablar%20de%20mi%20proyecto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group max-w-md bg-white/70 hover:bg-white p-2.5 rounded-2xl border border-slate-200/80 transition-all shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#25D366] transition-all">
                      <Phone className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-slate-950">WhatsApp Oficial</div>
                      <div className="text-slate-600 font-semibold text-sm">+506 7069-3708</div>
                      <div className="text-slate-400 text-xs font-sans">Respuesta rápida</div>
                    </div>
                  </a>

                  {/* Correo Electrónico */}
                  <a 
                    href="mailto:ventas@apcr.online"
                    className="flex items-center gap-4 group max-w-md bg-white/70 hover:bg-white p-2.5 rounded-2xl border border-slate-200/80 transition-all shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-slate-400 transition-all">
                      <Mail className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-slate-950">Correo Electrónico</div>
                      <div className="text-slate-600 font-semibold text-sm">ventas@apcr.online</div>
                    </div>
                  </a>
                </div>

                {/* Redes Sociales */}
                <div className="pt-4 border-t border-slate-300/80 max-w-md">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase block mb-3">
                    SÍGUENOS
                  </span>
                  <div className="flex items-center gap-3">
                    <a 
                      href="https://www.instagram.com/alfombraspersonalizadas.cr/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-11 h-11 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-pink-600 hover:scale-105 transition-all"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.facebook.com/alfombraspersonalizadascostarica" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-11 h-11 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@alfombraspersonal" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-11 h-11 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-black hover:scale-105 transition-all"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Columna Derecha: Tarjeta con QR Escanea para Chatear */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 max-w-sm w-full text-center group">
                  <div className="bg-white p-3 rounded-2xl mx-auto w-60 h-60 flex items-center justify-center border border-slate-100 shadow-inner">
                    <img 
                      src="/whatsapp-qr.png" 
                      alt="Escanea para Chatear" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-950 mt-5 tracking-tight">
                    Escanea para Chatear
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
                    Abre la cámara de tu celular y conecta directamente con nuestro equipo de ventas.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. FOOTER // EXACTAMENTE IGUAL AL DE APCR.ONLINE SOLICITADO */}
      <footer className="mt-12 border-t border-slate-200 bg-white/95 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Lado izquierdo: Derechos, ubicación y redes */}
          <div className="text-center md:text-left space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              © 2026 Alfombras Personalizadas CR.
            </p>
            <p className="text-xs text-slate-500">
              San José, Costa Rica. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2.5 pt-1 justify-center md:justify-start">
              <a 
                href="https://www.instagram.com/alfombraspersonalizadas.cr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-pink-600 hover:scale-105 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/alfombraspersonalizadascostarica" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@alfombraspersonal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-black hover:scale-105 transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Lado derecho: Tarjeta Atención Rápida con mini QR */}
          <div className="flex items-center gap-3.5 bg-white p-3.5 px-4 rounded-2xl border border-slate-200 shadow-xs">
            <img 
              src="/whatsapp-qr.png" 
              alt="QR WhatsApp" 
              className="w-12 h-12 bg-white rounded-lg p-0.5 border border-slate-200 object-contain shrink-0" 
            />
            <div className="text-left">
              <p className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                ATENCIÓN RÁPIDA
              </p>
              <p className="text-slate-500 text-xs">
                Escanea para chatear
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* 9. BOTÓN FLOTANTE DE WHATSAPP DIRECTO (+506 6063-8062) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        <div className="hidden sm:block bg-slate-900 text-white text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-800">
          {lang === 'es' ? 'Chatea al ' : 'Chat at '} {whatsappNumber}
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-[#25D366]/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer relative"
          aria-label="Contactar por WhatsApp"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </a>
      </div>

    </div>
  );
};
